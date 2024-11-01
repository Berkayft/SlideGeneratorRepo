class Theme{
    constructor(name, fontname0, fontname1, fontname2, bg0, bg1, bg2, bg3 , f0,f1,f2,f3) {
        this.name = name;          // Tema adı
        this.fonts = [fontname0, fontname1, fontname2]; // Font ailesi
        this.backgrounds = [bg0,bg1,bg2,bg3];
        this.fontcolors = [f0,f1,f2,f3];
    }

    getJsonObject() {
        return {
            name: this.name,
            fonts: this.fonts,
            backgrounds: this.backgrounds
        };
    }

}



module.exports = Theme;