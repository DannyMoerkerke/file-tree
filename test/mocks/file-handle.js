export class FileHandle {
  constructor(name, file = null) {
    this.kind = 'file';
    this.name = name;
    this.file = file
    this.foo = 'bar';
  }

  getFile() {
    return this.file || {name: 'foo.txt', type: 'text/plain', text() {return 'foo';}};
  }

  createWritable() {
    return Promise.resolve({
      write() {

      },
      close() {

      }
    })
  }

  queryPermission() {
    return Promise.resolve('granted');
  }
}
