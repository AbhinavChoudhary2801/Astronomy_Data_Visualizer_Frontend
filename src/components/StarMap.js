import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import axios from 'axios';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../styles/StarMap.css';

const StarMap = ({ showPlanets, showConstellations, searchTerm, filters, onSelect }) => {
  const mountRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

  useEffect(() => {
    const mountNode = mountRef.current;
    const width = mountNode.clientWidth;
    const height = mountNode.clientHeight;

    // Create Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountNode.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Raycaster and mouse setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let stars = [];
    let starMap = new Map();

    // ✅ Fetch stars
    const fetchStars = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stars', {
          params: {
            name: searchTerm,
            type: filters.type,
            magnitude: filters.mag,
            distance: filters.distance,
          },
        });

        const data = res.data;

        data.forEach((star) => {
          const geometry = new THREE.SphereGeometry(0.7, 16, 16);
          const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const sphere = new THREE.Mesh(geometry, material);
          sphere.position.set(star.position.x, star.position.y, star.position.z);
          sphere.userData = star;
          scene.add(sphere);
          stars.push(sphere);
          starMap.set(star.name, new THREE.Vector3(star.position.x, star.position.y, star.position.z));
        });
      } catch (error) {
        console.error('Failed to fetch stars:', error);
      }
    };

    // ✅ Add planets
    const fetchPlanets = () => {
      if (!showPlanets) return;

      const planetData = [
        { name: 'Sun', color: 0xffaa00, radius: 0 },
        { name: 'Mercury', color: 0xa9a9a9, radius: 10 },
        { name: 'Venus', color: 0xffcc00, radius: 15 },
        { name: 'Earth', color: 0x3399ff, radius: 22 },
        { name: 'Mars', color: 0xff0000, radius: 28 },
        { name: 'Jupiter', color: 0xffa500, radius: 38 },
        { name: 'Saturn', color: 0xffff66, radius: 48 },
        { name: 'Uranus', color: 0x66ffff, radius: 58 },
        { name: 'Neptune', color: 0x3333ff, radius: 68 },
      ];

      planetData.forEach((planet) => {
        const geometry = new THREE.SphereGeometry(planet.name === 'Sun' ? 3 : 1.2, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: planet.color });
        const mesh = new THREE.Mesh(geometry, material);

        if (planet.name === 'Sun') {
          mesh.position.set(0, 0, 0);

          const glowTexture = new THREE.TextureLoader().load(
            'https://threejs.org/examples/textures/lensflare/lensflare0.png'
          );
          const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xffaa00,
            transparent: true,
            blending: THREE.AdditiveBlending,
          });

          const glow = new THREE.Sprite(glowMaterial);
          glow.scale.set(15, 15, 1);
          mesh.add(glow);

          const sunLight = new THREE.PointLight(0xffcc88, 2, 200);
          mesh.add(sunLight);
        } else {
          const angle = Math.random() * Math.PI * 2;
          const x = planet.radius * Math.cos(angle);
          const z = planet.radius * Math.sin(angle);
          mesh.position.set(x, 0, z);
        }

        mesh.userData = { name: planet.name, type: 'Planet' };
        scene.add(mesh);
        stars.push(mesh);
      });
    };

    // ✅ Fetch constellations
    const fetchConstellations = async () => {
      if (!showConstellations) return;
      try {
        const res = await axios.get('http://localhost:5000/api/constellations');
        res.data.forEach((constellation) => {
          constellation.connections.forEach((pair) => {
            const start = starMap.get(pair[0]);
            const end = starMap.get(pair[1]);
            if (start && end) {
              const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
              const material = new THREE.LineBasicMaterial({ color: 0x00ffff });
              const line = new THREE.Line(geometry, material);
              scene.add(line);
            }
          });
        });
      } catch (err) {
        console.error('Error fetching constellations:', err);
      }
    };

    // ✅ Mouse hover (tooltip)
    const handleMouseMove = (event) => {
      const rect = mountNode.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stars);
      if (intersects.length > 0) {
        const object = intersects[0].object;
        setTooltip({
          visible: true,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          content: object.userData.name || 'Unknown',
        });
      } else {
        setTooltip({ visible: false, x: 0, y: 0, content: '' });
      }
    };

    // ✅ Click selection (send to parent)
    const handleClick = (event) => {
      const rect = mountNode.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stars);
      if (intersects.length > 0) {
        const object = intersects[0].object;
        onSelect(object.userData); // 🔥 Send clicked object data to Home
      } else {
        onSelect(null);
      }
    };

    mountNode.addEventListener('mousemove', handleMouseMove);
    mountNode.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    // Init
    const init = async () => {
      await fetchStars();
      fetchPlanets();
      await fetchConstellations();
      animate();
    };

    init();

    // Cleanup
    return () => {
      mountNode.removeEventListener('mousemove', handleMouseMove);
      mountNode.removeEventListener('click', handleClick);
      while (mountNode.firstChild) {
        mountNode.removeChild(mountNode.firstChild);
      }
    };
  }, [showPlanets, showConstellations, searchTerm, filters, onSelect]);

  // ✅ Render
  return (
    <div className="star-map-container">
      <div ref={mountRef} className="canvas-container" />
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default StarMap;
