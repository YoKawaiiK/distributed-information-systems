export class CurrentFile {
  isEdit;
  fileName;
  content;
  path;

  constructor(isEdit = false, fileName = null, content = null, path = null) {
    this.isEdit = isEdit;
    this.fileName = fileName;
    this.content = content;
    this.path = path;
  }
}
