import {FileHandle} from './file-handle.js';

export class DirectoryHandle {
  constructor(name, entries = {}) {
    this.name = name;
    this._entries = entries;
    this.kind = 'directory'
  }

  entries() {
    const self = this;

    return {
      *[Symbol.iterator]() {
        for(const entry of self._entries) {
          yield entry;
        }
      }
    }
  }

  getDirectoryHandle(name) {
    return new DirectoryHandle(name);
  }

  getFileHandle(name) {
    return new FileHandle(name);
  }

  async removeEntry() {

  }

  queryPermission() {
    return Promise.resolve('granted');
  }
}

export const directoryHandle = (name, entries = {}) => {
  return {
    name,
    kind: 'directory',
    _entries: entries,


    entries() {
      const self = this;

      return {
        *[Symbol.iterator]() {
          for(const entry of self._entries) {
            yield entry;
          }
        }
      }
    },

    getDirectoryHandle(name) {
      return directoryHandle(name);
    },

    getFileHandle(name) {
      return new FileHandle(name);
    },

    async removeEntry() {

    },

    toJSON() {
      return {
        name: 'this.name',
        kind: this.kind,
        entries: this.entries,
        _entries: this._entries
      }
    }
  }
};
