class Layout {
    constructor(nameOrObject, contentAreas = [],type ="", title = "") {
        if (typeof nameOrObject === 'object') {
            this.name = nameOrObject.name;
            this.contentAreas = nameOrObject.contentAreas || [];
            this.type = nameOrObject.type;
            this.title = nameOrObject.title;
        } else {
            this.name = nameOrObject;
            this.contentAreas = contentAreas;
            this.type = type;
            this.title = title;
        }
    }

    getJsonObject() {
        return {
            name: this.name,
            contentAreas: this.contentAreas.map(area => 
                typeof area.getJsonObject === 'function' ? area.getJsonObject() : area
            ),
            type:this.type,
            title:this.title
        };
    }
}


module.exports = Layout;

// imageWithCaption: new Layout("Image with Caption", [
//     new ContentArea("text", 0.1, 0.1, 0.8, 0.1, { 
//         fontSize: 36,
//         isBold: true 
//     }),
//     new ContentArea("image", 0.2, 0.25, 0.6, 0.5),
//     new ContentArea("text", 0.1, 0.8, 0.8, 0.1, { 
//         fontSize: 20,
//         align: 'center'
//     })
// ])