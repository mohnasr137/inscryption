import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import spline from "./imports/spline.js";
import caesar from "./imports/caesar.js";
import monoalphabetic from "./imports/monoalphabetic.js";
import playfair from "./imports/playfair.js";
const secretKey = import.meta.env.VITE_TEST_KEY;

const genAI = new GoogleGenerativeAI(secretKey);
const GenerativeAI = async (text, type) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  let prompt;
  if (type == "monoalphabetic") {
    prompt = `I used the ${type} cipher, and the decoding result is '${text}'. Please convert this result into a formal format, , making any necessary changes for better human understanding, Please respond with only the formal result.`;
  } else if (type == "playfair") {
    prompt = `I used the ${type} cipher, and the decoding result is '${text}'. Please convert this result into a formal format, making any necessary changes for better human understanding. During Playfair cipher encryption, the following modifications occur: the letter 'J' is replaced with 'I'; non-alphabetical characters (punctuation, spaces, numbers) are removed; all characters are converted to uppercase (e.g., 'Hello' becomes 'HELLO'); identical adjacent letters are separated by 'X' (e.g., 'HELLO' becomes 'HELX LO'); if the text has an odd number of letters, an 'X' is added at the end. The encoding process involves substituting letters based on their positions in a 5x5 matrix: if they are in the same row, they are shifted to the right (wrapping around if necessary); if they are in the same column, they are shifted down (wrapping around if needed); if they form a rectangle, the columns are swapped. These changes can significantly alter the appearance and length of the encoded text due to character replacements, uppercase conversion, added 'X' characters, and pairing. For example, the original text 'HELLO' undergoes several transformations: replacing 'J' (no change), removing non-alphas (no change), uppercasing (no change), pairing (transforms to ['HE', 'LX', 'LO']), and encoding based on matrix positions (results may vary). During decryption, the process is reversed, but differences may remain due to character replacements and initial formatting changes. Potential enhancements to the cipher could include handling additional characters, maintaining case sensitivity, and allowing dynamic matrix sizes based on keyword length. Please respond with only the formal result.`;
  }
  const result = await model.generateContent([prompt]);
  const response = result.response;
  return response.text();
};

function isMobile() {
  return /Mobi/i.test(navigator.userAgent);
}

if (WebGL.isWebGL2Available()) {
  const width = window.innerWidth;
  let height = window.innerHeight;
  if (isMobile()) {
    height = height + height / 5;
  }
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.6);

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  camera.position.z = 3;

  document.getElementById("backgroundCanvas").appendChild(renderer.domElement);
  renderer.setSize(width, height);
  renderer.setAnimationLoop(animate);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.5,
    0.4,
    100
  );
  bloomPass.threshold = 0.002;
  bloomPass.strength = 3.5;
  bloomPass.radius = 0;
  composer.addPass(bloomPass);

  const tubeGeometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
  const tubeMaterial = new THREE.MeshBasicMaterial({
    color: 0x1e90ff,
    wireframe: true,
  });
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(tube);

  const tubeEdges = new THREE.EdgesGeometry(tubeGeometry, 0.2);
  const tubeLineMaterial = new THREE.LineBasicMaterial({ color: 0xff4500 });
  const tubeLines = new THREE.LineSegments(tubeEdges, tubeLineMaterial);
  scene.add(tubeLines);

  const numBoxes = 100;
  const boxSize = 0.075;
  const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);

  for (let i = 0; i < numBoxes; i++) {
    const p = (i / numBoxes + Math.random() * 0.1) % 1;
    const position = tubeGeometry.parameters.path.getPointAt(p);
    position.x += Math.random() - 0.4;
    position.z += Math.random() - 0.4;

    const rotation = new THREE.Vector3(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    const boxEdges = new THREE.EdgesGeometry(boxGeometry, 0.2);
    const boxLineMaterial = new THREE.LineBasicMaterial({ color: 0xffd700 });
    const boxLines = new THREE.LineSegments(boxEdges, boxLineMaterial);

    boxLines.position.copy(position);
    boxLines.rotation.set(rotation.x, rotation.y, rotation.z);
    scene.add(boxLines);
  }

  window.addEventListener("resize", () => {
    if (isMobile() && width == window.innerWidth) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  const updateCamera = (t) => {
    const time = t * 0.1;
    const looptime = 15 * 1000;
    const p = (time % looptime) / looptime;
    const position = tubeGeometry.parameters.path.getPointAt(p);
    const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.03) % 1);
    camera.position.copy(position);
    camera.lookAt(lookAt);
  };

  function animate(t = 0) {
    updateCamera(t);
    composer.render(scene, camera);
  }
} else {
  const warning = WebGL.getWebGL2ErrorMessage();
  document.getElementById("container").appendChild(warning);
}

document
  .getElementById("inputForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.target.querySelector(".all");
    button.textContent = `Submitting...`;

    const text = document.getElementById("inputData").value;
    const optionSelect = document.getElementById("optionSelect").value;
    const useAI = document.querySelector('input[name="useAI"]:checked').value;
    const mode = document.querySelector('input[name="mode"]:checked').value;

    if (useAI == "true" && mode == "decrypt") {
      let data;
      if (optionSelect == 1) {
        document.getElementById("output").value = caesar({
          text,
          mode,
        });
      } else if (optionSelect == 2) {
        data = monoalphabetic({ text, mode });
        document.getElementById("output").value = await GenerativeAI(
          data,
          "monoalphabetic"
        );
      } else if (optionSelect == 3) {
        data = playfair({ text, mode });
        document.getElementById("output").value = await GenerativeAI(
          data,
          "playfair"
        );
      }
    } else {
      if (optionSelect == 1) {
        document.getElementById("output").value = caesar({ text, mode });
      } else if (optionSelect == 2) {
        document.getElementById("output").value = monoalphabetic({
          text,
          mode,
        });
      } else if (optionSelect == 3) {
        document.getElementById("output").value = playfair({
          text,
          mode,
        });
      }
    }
    button.textContent = "Submit";
  });

const optionSelect = document.getElementById("optionSelect");
optionSelect.addEventListener("change", function (event) {
  const selectedColor = event.target.value;
  if (selectedColor == 1) {
    document.getElementById("algorithmButton").href =
      "https://drive.google.com/drive/folders/1qx2MdJmufc7i51auhcvGa_CrxUHZtsqG";
  } else if (selectedColor == 2) {
    document.getElementById("algorithmButton").href =
      "https://drive.google.com/drive/folders/11AguK6mqs5cgsNjH42VVurJp06XP9lzG";
  } else if (selectedColor == 3) {
    document.getElementById("algorithmButton").href =
      "https://drive.google.com/drive/folders/1Gx3HP99TUHIOVu-NSOSWORtLmbbrnUzI";
  }
});
