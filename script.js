
// Importação da Biblioteca Three.js
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
// Importação dos Controles de Órbita da Câmera (Que irão permite mover a Câmera na Cena com o mouse)
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
// 1Iniciando a Biblioteca Three.js = Criando a Cena
const scene = new THREE.Scene();

//Configurando Padrões da Camêra
const camera = new THREE.PerspectiveCamera(
    75, //FOV (Field of View) - Campo de Visão
    window.innerWidth / window.innerHeight, //Aspect ratio - Proporção da tela
    0.1, // Distância Mínima de Visão
    1000 // Distância Máxima de Visão
);
camera.position.z = 8; // Posição Inicial da âmerad o Visualizador

// Renderizador da Cena
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x333333);
document.body.appendChild(renderer.domElement);

// ========== ILUMINAÇÃO ========== //

// Luz Direcional (simulando o sol - De cima)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Luz Pontual (como uma lâmpada - deixando mais Claro no Objeto)
const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// Objetos 3D 

// MeshPhongMaterial é a função que aceita o objeto ser Refletido por alguma iluminação
const objectSphere = new THREE.MeshPhongMaterial({ 
    shininess: 30 //O Quanto o Reflexo irá se concentrar em um só Ponto. Maior = mais concentrado (pequeno ponto branco de luz), Menor = mais espalhado, textura mais clara em uma área maior)
});
const objectCube = new THREE.MeshPhongMaterial({ 
    shininess: 30
});
const objectCilynder = new THREE.MeshPhongMaterial({ 
    shininess: 30
});

// Carregador de Textura
const textureLoader = new THREE.TextureLoader();

// Criando e Posicionando a Esfera
const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32); //1º Raio da Esfera, 2º segmentos Horizontais, e 3º Segmentos Verticais
const sphere = new THREE.Mesh(sphereGeometry, objectSphere);
sphere.position.set(-4, 0, 0);
scene.add(sphere);

// Criando e Posicionando o Cubo
const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2); //Altura, Largura, Profundidade
const cube = new THREE.Mesh(cubeGeometry, objectCube);
cube.position.set(0, 0, 0);
scene.add(cube); //Nesse caso, como não foi definido a posição do Cubo, ele será adicioando ao centro do Cenário, é o padrão do scene.add()

// Criando e Posicionando oCilindro
const cylinderGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32);  //1º Raio da Face de Cima do Cilindro, 2º Raio da Face de Baixo Cilindro, 3º Altura do Cilindro e 4º 
const cylinder = new THREE.Mesh(cylinderGeometry, objectCilynder);
cylinder.position.set(4, 0, 0);
scene.add(cylinder);

// Iniciando e Configurando o Controle de Órbita (Controle Utilizando no MOuse para Mexer a Câmera Presente na Cena)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; //Habiltia a Suavização do movimento
controls.dampingFactor = 0.1; //O quão Sauve Será o Movimento da Câmera
controls.screenSpacePanning = true; // Permite mover com botão direito do Mouse

// Configurações de velocidade das Transformações
const rotationSpeed = 0.08;
const moveSpeed = 0.2;
const scaleSpeed = 1.05;

// Estado das Teclas (Se foi pressionada e Solta)
const keyStates = {};
window.addEventListener('keydown', (e) => {
    keyStates[e.key.toLowerCase()] = true;
    handleTransformations();
});
window.addEventListener('keyup', (e) => {
    keyStates[e.key.toLowerCase()] = false;
});

// Função para Carregar a Textura dos Objetos
function loadTexture(mesh, url) {
    textureLoader.load(url, (texture) => {
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
    });
}

// Carregando das texturas presentes na Pasta Textures
loadTexture(sphere, 'textures/wood.png');
loadTexture(cube, 'textures/metal.png');
loadTexture(cylinder, 'textures/brick.png');

//Qual Objeto está selecionado,
let activeObject = sphere; // Variável para armazenar o objeto ativo

// Seleção de Objeto
document.querySelectorAll('.object-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove a classe 'active' de todos os botões
        document.querySelectorAll('.object-btn').forEach(b => b.classList.remove('active'));
            
        // Adiciona 'active' apenas no botão clicado
        btn.classList.add('active');
            
        // Atualiza o objeto ativo
        switch(btn.dataset.object) {
            case 'cube': activeObject = cube; break;
            case 'sphere': activeObject = sphere; break;
            case 'cylinder': activeObject = cylinder; break;
        }
    });
});

// Função para Tratar as Transformações
//ual tecla foi pressionada, e o que cada tecla irá fazer
function handleTransformations() {

// Configuração dos botões

    // Rotação (setinhas ↑↓←→)
    if (keyStates['arrowup']) activeObject.rotation.x += rotationSpeed;
    if (keyStates['arrowdown']) activeObject.rotation.x -= rotationSpeed;
    if (keyStates['arrowleft']) activeObject.rotation.y -= rotationSpeed;
    if (keyStates['arrowright']) activeObject.rotation.y += rotationSpeed;

    // Translação (WASD, Espaço e Shift)
    if (keyStates['w']) activeObject.position.z -= moveSpeed;
    if (keyStates['s']) activeObject.position.z += moveSpeed;
    if (keyStates['a']) activeObject.position.x -= moveSpeed;
    if (keyStates['d']) activeObject.position.x += moveSpeed;
    if (keyStates[' ']) activeObject.position.y += moveSpeed; // Espaço sobe
    if (keyStates['shift']) activeObject.position.y -= moveSpeed; // Shift desce

    // Escalanomento (Q/E)
    if (keyStates['q']) activeObject.scale.multiplyScalar(1/scaleSpeed);
    if (keyStates['e']) activeObject.scale.multiplyScalar(scaleSpeed);
    
    // Resetar as Transfomações Aplicadas no Objeto (R)
    // Resetar as Transfomações Aplicadas no Objeto (R)
    if (keyStates['r']) {
        activeObject.rotation.set(0, 0, 0);
        // Corrigindo a Posição dO Reset Baseada no Objeto Ativo no Momento
        if (activeObject === sphere) {
            activeObject.position.set(-4, 0, 0);
        } else if (activeObject === cube) {
            activeObject.position.set(0, 0, 0);
        } else if (activeObject === cylinder) {
            activeObject.position.set(4, 0, 0);
        }
        activeObject.scale.set(1, 1, 1);
    }
}

//Função que Permite a Animação dos Objetos na Cena (Essencial, inclusive para que sejam criados no ambiente 3D)
// Animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Redimensionamento Responsivo
//Ajusata automaticamente a visualização com base no redimensionamento da tela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});