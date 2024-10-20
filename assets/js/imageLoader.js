class ImageLoader {
  cache = {};

  /**
   * @param {string} path
   * @returns {Promise<HTMLImageElement>}
   */
  load(path) {
    console.time(`Loading image ${path}`);

    if (this.cache[path]) {
      console.timeEnd(`Loading image ${path}`);
      return Promise.resolve(this.cache[path]);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        console.timeEnd(`Loading image ${path}`);
        this.cache[path] = img;
        resolve(img);
      };
      img.onerror = (error) => reject(error);
    });
  }

  /**
   * @param {string} path
   * @returns {HTMLImageElement|undefined}
   */
  get(path) {
    return this.cache[path];
  }
}

const imageLoader = new ImageLoader();

window.imageLoader = imageLoader;

export function loadImages() {
  return Promise.all([
    imageLoader.load("/assets/images/grass.png"),
    imageLoader.load("/assets/images/dirt.png"),
    imageLoader.load("/assets/images/blocked_tile.png"),
    imageLoader.load("/assets/images/crop.png"),
    imageLoader.load("/assets/images/mature.png"),
    imageLoader.load("/assets/images/robot/left-bottom.png"),
    imageLoader.load("/assets/images/robot/right-bottom.png"),
    imageLoader.load("/assets/images/robot/left-top.png"),
    imageLoader.load("/assets/images/robot/right-top.png"),
  ]).then(() => {
    document.getElementById("loading").setAttribute("data-loaded", true);
  });
}

export default imageLoader;
