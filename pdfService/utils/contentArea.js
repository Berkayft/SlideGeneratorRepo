class ContentArea {
    constructor(typeOrObject, x = 0, y = 0, width = 100, height = 100, options = {}) {
        if (typeof typeOrObject === 'object') {
            // Eğer bir nesne geçildiyse, JSON nesnesi olarak kabul et
            this.type = typeOrObject.type;
            this.x = typeOrObject.x;
            this.y = typeOrObject.y;
            this.w = typeOrObject.width;
            this.h = typeOrObject.height;
            this.options = typeOrObject.options || {};
        } else {
            // Eğer tek tek argümanlar geçildiyse
            this.type = typeOrObject;
            this.x = x;
            this.y = y;
            this.w = width;
            this.h = height;
            this.options = options;
        }
    }

    getJsonObject() {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            options: this.options
        };
    }
}

module.exports = ContentArea;