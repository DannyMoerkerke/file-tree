import {DirectoryHandle} from './directory-handle.js';
import {FileHandle} from './file-handle.js';

export const mainCssFileContents = `body {
    margin: 0;
    font-family: Arial;
  }
  
  main {
    display: flex;
  }
`;

export const mainCssFile = {
  name: 'main.css',
  type: 'text/css',
  text() {
    return mainCssFileContents
  }
};

export const mainCssFileHandle = new FileHandle('main.css', mainCssFile);
const stylesCssFileHandle = new FileHandle('styles.css');
const sharedCssFileHandle = new FileHandle('shared.css');


const cssEntries = [
  ['main.css', mainCssFileHandle],
  ['styles.css', stylesCssFileHandle],
  ['shared.css', sharedCssFileHandle]
];

export const cssDirHandle = new DirectoryHandle('css', cssEntries);

export const emailPngFileHandle = new FileHandle('email.png');
const closePngFileHandle = new FileHandle('close.png');
const checkPngFileHandle = new FileHandle('check.png');

const iconEntries = [
  ['email.png', emailPngFileHandle],
  ['close.png', closePngFileHandle],
  ['check.png', checkPngFileHandle]
];

export const iconDirHandle = new DirectoryHandle('icons', iconEntries);

const headerPngFileHandle = new FileHandle('header.png');
const logoJpgFileHandle = new FileHandle('logo.jpg');
const bannerPngFileHandle = new FileHandle('banner.png');

export const imgEntries = [
  ['icons', iconDirHandle],
  ['header.png', headerPngFileHandle],
  ['logo.jpg', logoJpgFileHandle],
  ['banner.png', bannerPngFileHandle]
];

export const imgDirHandle = new DirectoryHandle('img', imgEntries);

export const mainJsFileHandle = new FileHandle('main.js');
const indexJsFileHandle = new FileHandle('index.js');
const appJsFileHandle = new FileHandle('app.js');

const jsEntries = [
  ['index.js', indexJsFileHandle],
  ['main.js', mainJsFileHandle],
  ['app.js', appJsFileHandle]
];

export const jsDirHandle = new DirectoryHandle('js', jsEntries);

export const indexHtmlFileContents = `
  <html>
    <body>
      <main></main>
    </body>
  </html>
`;

export const indexHtmlFile = {
  name: 'index.html',
  type: 'text/html',
  text() {
    return indexHtmlFileContents;
  }
};

export const indexHtmlFileHandle = new FileHandle('index.html');
export const manifestJsonFileHandle = new FileHandle('manifest.json');
export const srcDirEntries = [
  ['css', cssDirHandle],
  ['img', imgDirHandle],
  ['js', jsDirHandle],
  ['index.html', indexHtmlFileHandle],
  ['manifest.json', manifestJsonFileHandle]
];

export const srcDirHandle = new DirectoryHandle('src', srcDirEntries);

const imgDirectoryEntries = {
  'src/img/header.png': {
    path: 'src/img/header.png',
    handle: headerPngFileHandle,
    parentHandle: imgDirHandle,
    fileContent: ''
  },
  'src/img/logo.jpg': {
    path: 'src/img/logo.jpg',
    handle: logoJpgFileHandle,
    parentHandle: imgDirHandle,
    fileContent: ''
  },

  'src/img/banner.png': {
    path: 'src/img/banner.png',
    handle: bannerPngFileHandle,
    parentHandle: imgDirHandle,
    fileContent: ''
  },
  'src/img/icons': {
    path: 'src/img/icons',
    handle: iconDirHandle,
    parentHandle: imgDirHandle,
    entries: {
      'src/img/icons/email.png': {
        path: 'src/img/icons/email.png',
        handle: emailPngFileHandle,
        parentHandle: iconDirHandle,
        fileContent: ''
      },
      'src/img/icons/close.png': {
        path: 'src/img/icons/close.png',
        handle: emailPngFileHandle,
        parentHandle: iconDirHandle,
        fileContent: ''
      },
      'src/img/icons/check.png': {
        path: 'src/img/icons/check.png',
        handle: emailPngFileHandle,
        parentHandle: iconDirHandle,
        fileContent: ''
      },
    }
  }
};

export const currentDirectory = {
  path: 'src',
  indexed: false,
  handle: srcDirHandle,
  entries: {
    'src/index.html': {
      path: 'src/index.html',
      handle: indexHtmlFileHandle,
      parentHandle: srcDirHandle,
      fileContent: indexHtmlFileContents
    },
    'src/manifest.json': {
      path: 'src/manifest.json',
      handle: manifestJsonFileHandle,
      parentHandle: srcDirHandle
    },
    'src/css': {
      path: 'src/css',
      handle: cssDirHandle,
      parentHandle: srcDirHandle,
      entries: {
        'src/css/main.css': {
          path: 'src/css/main.css',
          handle: mainCssFileHandle,
          parentHandle: cssDirHandle,
          fileContent: mainCssFileContents
        },
        'src/css/styles.css': {
          path: 'src/css/styles.css',
          handle: stylesCssFileHandle,
          parentHandle: cssDirHandle
        },
        'src/css/shared.css': {
          path: 'src/css/shared.css',
          handle: sharedCssFileHandle,
          parentHandle: cssDirHandle
        }
      }
    },
    'src/img': {
      path: 'src/img',
      handle: imgDirHandle,
      parentHandle: srcDirHandle,
      entries: imgDirectoryEntries
    },
    'src/js': {
      path: 'src/js',
      handle: jsDirHandle,
      parentHandle: srcDirHandle,
      entries: {}
    }
  }
};

export const cssDirectoryEntries = {
  'src/css/main.css': {
    path: 'src/css/main.css',
    handle: mainCssFileHandle,
    parentHandle: cssDirHandle,
    fileContent: mainCssFileContents
  },
  'src/css/styles.css': {
    path: 'src/css/styles.css',
    handle: stylesCssFileHandle,
    parentHandle: cssDirHandle
  },
  'src/css/shared.css': {
    path: 'src/css/shared.css',
    handle: sharedCssFileHandle,
    parentHandle: cssDirHandle
  }
}
