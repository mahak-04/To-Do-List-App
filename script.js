import * as THREE from 'three';

class NeuralTaskEngine {
    constructor() {
        this.tasks = [];
        this.initThree();
        this.initParticles();
        this.bindEvents();
        this.render();
        this.startTimers();
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        this.taskGroup = new THREE.Group();
        this.scene.add(this.taskGroup);

        this.camera.position.z = 8;
        
        const light = new THREE.PointLight(0x00f2ff, 2, 50);
        light.position.set(0, 5, 5);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040));
    }

    initParticles() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 5000; i++) {
            vertices.push(THREE.MathUtils.randFloatSpread(20)); // x
            vertices.push(THREE.MathUtils.randFloatSpread(20)); // y
            vertices.push(THREE.MathUtils.randFloatSpread(20)); // z
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.02 });
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createTaskNode(text, priority) {
        const colors = { low: 0x00f2ff, med: 0xbc13fe, high: 0xff0055 };
        const color = colors[priority] || 0x00f2ff;

        // Create 3D Object
        const geometry = new THREE.IcosahedronGeometry(0.5, 0);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            wireframe: true,
            emissive: color,
            emissiveIntensity: 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4
        );

        const taskObj = {
            id: Date.now(),
            text,
            priority,
            mesh,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                0
            )
        };

        this.taskGroup.add(mesh);
        this.tasks.push(taskObj);
        this.updateUI();
    }

    updateUI() {
        document.getElementById('node-count').innerText = `${this.tasks.length} Nodes Active`;
        const load = Math.min(this.tasks.length * 10, 100);
        document.getElementById('load-pct').innerText = `${load}%`;
    }

    bindEvents() {
        document.getElementById('add-task-btn').addEventListener('click', () => {
            const input = document.getElementById('task-input');
            const priority = document.getElementById('priority-select').value;
            if (input.value) {
                this.createTaskNode(input.value, priority);
                input.value = '';
            }
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    startTimers() {
        setInterval(() => {
            const now = new Date();
            document.getElementById('current-date').innerText = now.toLocaleString();
            
            // Simple uptime simulator
            const seconds = Math.floor(performance.now() / 1000);
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            document.getElementById('uptime-timer').innerText = `${h}:${m}:${s}`;
        }, 1000);
    }

    render() {
        requestAnimationFrame(() => this.render());

        // Animate particles
        this.particles.rotation.y += 0.001;

        // Animate tasks
        this.tasks.forEach(task => {
            task.mesh.rotation.x += 0.01;
            task.mesh.rotation.y += 0.01;
            
            // Movement physics
            task.mesh.position.add(task.velocity);

            // Bounce off boundaries
            if (Math.abs(task.mesh.position.x) > 6) task.velocity.x *= -1;
            if (Math.abs(task.mesh.position.y) > 4) task.velocity.y *= -1;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize System
new NeuralTaskEngine();
