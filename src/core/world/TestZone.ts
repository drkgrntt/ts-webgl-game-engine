// import SpriteComponent from '../components/SpriteComponent.js'
// import SimObject from './SimObject.js'
// import Zone from './Zone.js'

// export default class TestZone extends Zone {
//   private _parentObject: SimObject
//   private _testObject: SimObject
//   private _testSprite: SpriteComponent

//   load(): void {
//     this._parentObject = new SimObject(0, 'parentObject')
//     this._parentObject.transform.position.x = 300
//     this._parentObject.transform.position.y = 300

//     this._testObject = new SimObject(1, 'testObject')
//     this._testSprite = new SpriteComponent('test', 'crate')
//     this._testObject.addComponent(this._testSprite)

//     this._testObject.transform.position.x = 30
//     this._testObject.transform.position.y = 30

//     this._parentObject.addChild(this._testObject)

//     this.scene.addObject(this._parentObject)

//     super.load()
//   }

//   update(time: number): void {
//     this._testObject.transform.rotation.z -= 0.02
//     this._parentObject.transform.rotation.z += 0.01
//     super.update(time)
//   }
// }
