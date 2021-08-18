import Material from './Material.js'

class MaterialReferenceNode {
  material: Material
  referenceCount: number = 1

  constructor(material: Material) {
    this.material = material
  }
}

export default class MaterialManager {
  private static _materials: Record<string, MaterialReferenceNode> =
    {}

  private constructor() {}

  static registerMaterial(material: Material): void {
    if (!MaterialManager._materials[material.name]) {
      MaterialManager._materials[material.name] =
        new MaterialReferenceNode(material)
    }
  }

  static getMaterial(materialName: string): Material | void {
    if (!MaterialManager._materials[materialName]) {
      return
    }

    MaterialManager._materials[materialName].referenceCount++
    return MaterialManager._materials[materialName].material
  }

  static releaseMaterial(materialName: string): void {
    if (!MaterialManager._materials[materialName]) {
      console.warn(
        `Cannot release a material which has not been registered: ${materialName}`
      )
      return
    }

    MaterialManager._materials[materialName].referenceCount--
    if (MaterialManager._materials[materialName].referenceCount < 1) {
      MaterialManager._materials[materialName].material.destroy()
      delete MaterialManager._materials[materialName]
    }
  }
}
