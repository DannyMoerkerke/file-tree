export const template = `
<div id="intro">
  <h1>file-tree demo</h1>
  <p>
    <code>&lt;file-tree&gt;</code> gives access to the file system of the user's device through the File System Access API.
  </p>
  <p>It is currently supported on desktop in Chrome 86+ and Edge86+.</p>
  <p>
    Click the "Open directory" button below to select a directory of file. Click a file to open it in the preview.
  </p>
  <p>
    Text-based files can be edited and saved back to the file system.
  </p>
  <p>
    Enter a search query in the input on the right to search for files or inside files. The files in the search
    results can then by opened by clicking.
  </p>
</div>

<section id="file-container">

  <file-tree>
    <button type="button" slot="browse-button">Open directory</button>
  </file-tree>

  <div id="file-preview">
    <div class="buttons">
      <button type="button" id="save-button" label="Save" raised disabled>Save</button>
      <button type="button" id="save-as-button" label="Save as..." raised disabled>Save as...</button>
    </div>
    <div id="file-content"></div>
  </div>

  <div id="search">
    <div id="search-container">
      <div class="controls">
        <div id="search-type">
          <label>
            <input type="radio" name="search-type" value="files" checked>
            Search files
          </label>

          <label>
            <input type="radio" name="search-type" value="in-files">
            Search in files
          </label>
        </div>
        <input type="text" name="query" placeholder="Search" disabled>
      </div>
      <div id="search-results"></div>
    </div>
  </div>
</section>
`;
