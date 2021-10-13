import router from './router.js';
import {template as index} from '../templates/index.js';
import {template as gettingStarted} from '../templates/getting-started.js';
import {template as documentation} from '../templates/documentation.js';

const outlet = document.querySelector('#content');

router(outlet, [
  {
    url: '/file-tree',
    template: index,
    controller() {
      const fileContent = document.querySelector('#file-content');
      const fileTree = document.querySelector('file-tree');
      const saveButton = document.querySelector('#save-button');
      const saveAsButton = document.querySelector('#save-as-button');
      const query = document.querySelector('[name="query"]');
      const searchResults = document.querySelector('#search-results');
      const searchTypes = [...document.querySelectorAll('[name="search-type"]')];

      const openFile = ({detail}) => {
        saveButton.disabled = true;
        saveAsButton.disabled = true;

        const {type, contents} = detail.file;
        switch(type) {
          case 'image/png':
          case 'image/jpg':
          case 'image/jpeg':
          case 'image/gif':
            fileContent.innerHTML = `<img src="${contents}">`;

            break;
          case 'image/svg+xml':
            fileContent.innerHTML = contents;

            break;

          default:
            fileContent.innerHTML = `<textarea>${contents}</textarea>`;
            saveButton.disabled = false;
            saveAsButton.disabled = false;
        }
      };

      const saveFile = () => fileTree.saveFile(fileContent.querySelector('textarea').value);

      const saveFileAs = () => fileTree.saveFileAs(fileContent.querySelector('textarea').value);

      const search = async () => {
        const searchType = searchTypes.find((type) => type.checked).value;

        const term = query.value;

        if(term.trim() !== '') {
          const {results} = searchType === 'files' ? fileTree.findFile(term) : await fileTree.findInFiles(term);

          const listFoundFiles = (list, {path, highlight}) => {
            list.insertAdjacentHTML('beforeend', `<li data-path="${path}">${highlight[1]} <span class="path">${highlight[0]}</span></li>`);

            return list;
          };

          const listFoundInFiles = (list, {path, rows}) => {
            const file = path.split('/').pop();
            list.insertAdjacentHTML('beforeend', `<li data-path="${path}"><strong>${file}</strong></li>`);

            rows.forEach(({line, content}) => list.insertAdjacentHTML('beforeend', `<li data-path="${path}" data-line="${line}">${line}: ${content}</li>`));

            return list;
          };

          const listSearchResults = searchType === 'files' ? listFoundFiles: listFoundInFiles;

          const resultsList = results.reduce(listSearchResults, document.createElement('ul'));

          searchResults.innerHTML = '';
          searchResults.insertAdjacentElement('beforeend', resultsList);
        }
        else {
          searchResults.innerHTML = '';
        }
      };

      const selectLine = line => {
        const textarea = fileContent.querySelector('textarea');
        const lineNum = line - 1;
        const lines = textarea.value.split('\n');
        const startPos = lines.slice(0, lineNum).reduce((sum, line) => sum + line.length + 1, 0);
        const endPos = lines[lineNum].length + startPos;

        textarea.focus();
        textarea.selectionStart = startPos;
        textarea.selectionEnd = endPos;
      };

      const openFoundFile = (e) => {
        const li = [...e.composedPath()].find(el => el.matches && el.matches('li'));

        if(li) {
          const file = li.dataset.path;
          fileTree.openFileByPath(file);

          if(li.dataset.line !== undefined) {
            setTimeout(() => selectLine(li.dataset.line), 250)
          }
        }
      };

      const debounce = (func, delay, immediate) => {
        let timeout;

        return function() {
          const context = this;
          const args = arguments;

          const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };

          const callNow = immediate && !timeout;

          clearTimeout(timeout);
          timeout = setTimeout(later, delay);

          if(callNow) {
            func.apply(context, args);
          }
        };
      };

      const onReady = () => query.disabled = false;
      const onBrowsing = () => query.disabled = true;
      const debouncedSearch = debounce(search, 500);

      saveButton.addEventListener('click', saveFile);
      saveAsButton.addEventListener('click', saveFileAs);
      fileTree.addEventListener('ready', onReady);
      fileTree.addEventListener('browsing', onBrowsing);
      fileTree.addEventListener('file-selected', openFile);
      query.addEventListener('keyup', debouncedSearch);
      searchResults.addEventListener('click', openFoundFile);
    }
  },
  {
    url: '/file-tree/getting-started',
    template: gettingStarted
  },
  {
    url: '/file-tree/documentation',
    template: documentation
  }
]);
