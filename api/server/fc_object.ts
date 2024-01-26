// @ts-ignore
interface FCObjectInterface {
  modelAddProperty: (data: any) => void;
  modelCustomPropertyMapper: () => object;
  modelContainerPropertyGenericClass: () => object;
}

// @ts-ignore
export class FCObject implements FCObjectInterface {
  private _data = null;
  constructor(data: any) {
    this._data = data;
  }
  modelAddProperty(data: any) {
    if (data) {
      
              for (let key in data) {
                      let propertyKey = key;
                      if (this.hasOwnProperty('modelCustomPropertyMapper')) {
                        // @ts-ignore
                        propertyKey = this.modelContainerPropertyGenericClass()[key]
                          ? this.modelCustomPropertyMapper()[key]
                          : key;
                      }
                      if (this.hasOwnProperty('modelContainerPropertyGenericClass')) {
                        if (this.modelContainerPropertyGenericClass()[propertyKey]) {
                          let Class = this.modelContainerPropertyGenericClass()[propertyKey];
                          if (data[key] instanceof Array) {
                            this[propertyKey] = [];
                            for (let eachData of data[key]) {
                              let obj = new Class(eachData);
                              this[propertyKey].push(obj);
                            }
                          } else {
                            this[propertyKey] = new Class(data[key]);
                          }
                          continue;
                        }
                      }
                      this[propertyKey] = data[key];
                    }
      
      
    }
  }

  modelCustomPropertyMapper = function () {
    return {};
  };

  modelContainerPropertyGenericClass = function () {
    return {};
  };
}
