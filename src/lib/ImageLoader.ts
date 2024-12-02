class ImageLoader {
  cache = {};

  public load(path: string) {
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

  public get(path: string) {
    return this.cache[path];
  }

  public async loadImages() {
    await Promise.all([
      this.load("/assets/images/grass.png"),
      this.load("/assets/images/dirt.png"),
      this.load("/assets/images/blocked_tile.png"),
      this.load("/assets/images/crop.png"),
      this.load("/assets/images/mature.png"),
      this.load("/assets/images/robot/left-bottom.png"),
      this.load("/assets/images/robot/right-bottom.png"),
      this.load("/assets/images/robot/left-top.png"),
      this.load("/assets/images/robot/right-top.png"),
    ]);

    document.getElementById("loading")?.setAttribute("data-loaded", "true");
  }
}

export default new ImageLoader();
