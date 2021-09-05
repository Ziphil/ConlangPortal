//


export class SuperEntry {

  public changeInformations(informations: any): void {
    let anyThis = this as any;
    for (let [key, value] of Object.entries(informations)) {
      if (value !== undefined) {
        anyThis[key] = value;
        if (key === "name") {
          anyThis.names[anyThis.kind] = value;
        }
      }
    }
  }

}