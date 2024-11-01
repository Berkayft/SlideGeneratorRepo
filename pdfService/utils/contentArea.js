class ContentArea {
    constructor(typeOrObject, x = 0, y = 0, width = 100, height = 100, options = {}) {
        if (typeof typeOrObject === 'object') {
            // Eğer bir nesne geçildiyse, JSON nesnesi olarak kabul et
            this.type = typeOrObject.type;
            this.x = typeOrObject.x;
            this.y = typeOrObject.y;
            this.width = typeOrObject.width;
            this.height = typeOrObject.height;
            this.options = typeOrObject.options || {};
        } else {
            // Eğer tek tek argümanlar geçildiyse
            this.type = typeOrObject;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.options = options;
        }
    }

    getJsonObject() {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            options: this.options
        };
    }
}

module.exports = ContentArea;