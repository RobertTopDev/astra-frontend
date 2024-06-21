import React, { Component, createRef } from 'react'
import suneditor from 'suneditor'
import { en } from 'suneditor/src/lang'
import plugins from 'suneditor/src/plugins'
import CodeMirror from 'codemirror'
import katex from 'katex'
import 'suneditor/dist/css/suneditor.min.css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/lib/codemirror.css'
import 'katex/dist/katex.min.css'
import './Editor.scss'

interface Props {
  contents?: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  onBlur?: Function
  onSave: (contents: string) => void
}

interface State {
  imageList: any[]
  selectedImages: any[]
  imageSize: string
}

class SunEditor extends Component<Props, State> {
  txtArea: any
  editor: any

  constructor(props: any) {
    super(props)
    this.txtArea = createRef()
    this.state = {
      imageList: [],
      selectedImages: [],
      imageSize: '0KB',
    }
  }

  componentDidMount() {
    const editor: any = (this.editor = suneditor.create(this.txtArea.current, {
      plugins: plugins,
      lang: en,
      callBackSave: (contents: string) => this.props.onSave(contents),
      codeMirror: CodeMirror,
      stickyToolbar: 0,
      katex: katex,
      width: '100%',
      height: 'auto',
      minHeight: '400px',
      value: this.props.contents,
      // imageUploadUrl: `url`,
      imageMultipleFile: true,
      previewTemplate: `
                <div style="width:auto; max-width:1136px; min-height:400px; margin:auto;">
                {{contents}}
                </div>
            `,
      buttonList: [
        // default
        ['undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['paragraphStyle', 'blockquote'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor', 'textStyle'],
        ['removeFormat'],
        ['outdent', 'indent'],
        ['align', 'horizontalRule', 'list', 'lineHeight'],
        ['table', 'link', 'image', 'video'],
        ['fullScreen', 'showBlocks', 'codeView'],
        ['preview'],
        ['save'],
        // responsive
        [
          '%1161',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            [
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
            ],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
            [
              '-right',
              ':r-Table&Media-default.more_plus',
              'table',
              'link',
              'image',
              'video',
            ],
          ],
        ],
        [
          '%893',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            ['bold', 'underline', 'italic', 'strike'],
            [
              ':t-Fonts-default.more_text',
              'subscript',
              'superscript',
              'fontColor',
              'hiliteColor',
              'textStyle',
            ],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
            [
              '-right',
              ':r-Table&Media-default.more_plus',
              'table',
              'link',
              'image',
              'video',
            ],
          ],
        ],
        [
          '%855',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            [
              ':t-Fonts-default.more_text',
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
              'fontColor',
              'hiliteColor',
              'textStyle',
            ],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            [
              ':r-Table&Media-default.more_plus',
              'table',
              'link',
              'image',
              'video',
            ],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
          ],
        ],
        [
          '%563',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            [
              ':t-Fonts-default.more_text',
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
              'fontColor',
              'hiliteColor',
              'textStyle',
            ],
            ['removeFormat'],
            ['outdent', 'indent'],
            [
              ':e-List&Line-default.more_horizontal',
              'align',
              'horizontalRule',
              'list',
              'lineHeight',
            ],
            [
              ':r-Table&Media-default.more_plus',
              'table',
              'link',
              'image',
              'video',
            ],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
          ],
        ],
        [
          '%458',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            [
              ':t-Fonts-default.more_text',
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
              'fontColor',
              'hiliteColor',
              'textStyle',
              'removeFormat',
            ],
            [
              ':e-List&Line-default.more_horizontal',
              'outdent',
              'indent',
              'align',
              'horizontalRule',
              'list',
              'lineHeight',
            ],
            [
              ':r-Table&Media-default.more_plus',
              'table',
              'link',
              'image',
              'video',
            ],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
          ],
        ],
      ],
    }))

    editor.onBlur = () => {
      if (typeof this.props.onBlur === 'function') this.props.onBlur()
    }

    editor.onImageUpload = this.imageUpload.bind(this)
    // editor.onVideoUpload = videoUpload;
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.contents !== prevProps.contents) {
      this.editor.setContents(this.props.contents)
      this.editor.core.history.reset(true)
    }
  }

  componentWillUnmount() {
    if (this.editor) this.editor.destroy()
  }

  // image, video
  findIndex(arr: any[], index: number) {
    let idx = -1

    arr.some(function (a, i) {
      if ((typeof a === 'number' ? a : a.index) === index) {
        idx = i
        return true
      }
      return false
    })

    return idx
  }

  imageUpload(
    targetElement: Element,
    index: number,
    state: string,
    imageInfo: Record<string, string>,
    remainingFilesCount: number
  ) {
    if (state === 'delete') {
      this.state.imageList.splice(
        this.findIndex(this.state.imageList, index),
        1
      )
      this.setState({
        imageList: this.state.imageList,
      })
    } else {
      if (state === 'create') {
        const imageList = this.state.imageList
        imageList.push(imageInfo)
        this.setState({
          imageList: imageList,
        })
      } else {
        console.log('this is update field')
        // update
        //
      }
    }

    if (remainingFilesCount === 0) {
      this.setImageList()
    }
  }

  setImageList() {
    const imageList = this.state.imageList
    let size = 0

    for (let i = 0; i < imageList.length; i++) {
      size += Number((imageList[i].size / 1000).toFixed(1))
    }

    this.setState({
      imageSize: size.toFixed(1) + 'KB',
    })
  }

  selectImage(evt: any, type: string, index: number) {
    evt.preventDefault()
    evt.stopPropagation()
    this.state.imageList[this.findIndex(this.state.imageList, index)][type]()
  }

  checkImage(index: number) {
    const selectedImages = this.state.selectedImages
    const currentImageIdx = this.findIndex(selectedImages, index)

    if (currentImageIdx > -1) {
      selectedImages.splice(currentImageIdx, 1)
    } else {
      selectedImages.push(index)
    }

    this.setState({
      selectedImages: selectedImages,
    })
  }

  deleteCheckedImages() {
    const iamgesInfo = this.editor.getImagesInfo()

    for (let i = 0; i < iamgesInfo.length; i++) {
      if (
        this.state.selectedImages.indexOf(iamgesInfo[i].index as number) > -1
      ) {
        iamgesInfo[i].delete()
        i--
      }
    }

    this.setState({
      selectedImages: [],
    })
  }

  fileUploadToEditor(e: any) {
    if (e.target.files) {
      this.editor.insertImage(e.target.files)
      e.target.value = ''
    }
  }

  render() {
    return (
      <div>
        <textarea ref={this.txtArea} />
        <div className="component-list">
          <div className="file-list-info">
            <span>Attach files</span>
            <span className="xefu-btn">
              <span className="files-text">Images</span>
            </span>
            <input
              type="file"
              id="files_upload"
              accept=".jpg, .jpeg, .png, .ico, .tif, .tiff, .gif, .bmp, .raw"
              multiple
              className="files-text files-input"
              onChange={(e: any) => this.fileUploadToEditor(e)}
            />
            <span id="image_size" className="total-size text-small-2">
              {this.state.imageSize}
            </span>
            <button
              className="btn btn-md btn-danger"
              id="image_remove"
              disabled={this.state.selectedImages.length === 0}
              onClick={() => this.deleteCheckedImages()}
            >
              Delete
            </button>
          </div>
          <div className="file-list">
            <ul id="image_list">
              {this.state.imageList.map((v, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => this.checkImage(v.index)}
                    className={
                      this.state.selectedImages.includes(v.index)
                        ? 'checked'
                        : ''
                    }
                  >
                    <div>
                      <div className="image-wrapper">
                        <img src={v.src} />
                      </div>
                    </div>
                    <a
                      onClick={(evt: any) =>
                        this.selectImage(evt, 'select', v.index)
                      }
                      className="image-size"
                    >
                      {(v.size / 1000).toFixed(1)}KB
                    </a>
                    <div className="image-check">
                      <svg
                        aria-hidden="true"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                        ></path>
                      </svg>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default SunEditor
