'use client'

import React, { useMemo, useCallback, MutableRefObject } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import ImageResize from 'quill-resize-image'

// Register the quill-resize-image module
Quill.register('modules/imageResize', ImageResize)

const fontSizeArr = [
  '8px',
  '9px',
  '10px',
  '12px',
  '14px',
  '16px',
  '20px',
  '24px',
  '32px',
  '42px',
  '54px',
  '68px',
  '84px',
  '98px',
]
const Size: any = Quill.import('attributors/style/size')
Size.whitelist = fontSizeArr
Quill.register(Size, true)

const BlockEmbed: any = Quill.import('blots/block/embed')

class ImageBlot extends BlockEmbed {
  static create(value: {
    alt: string
    url: string
    width: string
    height: string
    style: string
  }) {
    const node = super.create() as HTMLElement
    node.setAttribute('alt', value.alt)
    node.setAttribute('src', value.url)
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    node.setAttribute('style', value.style)
    return node
  }

  static value(node: HTMLElement) {
    return {
      alt: node.getAttribute('alt') || '',
      url: node.getAttribute('src') || '',
      width: node.getAttribute('width') || '',
      height: node.getAttribute('height') || '',
      style: node.getAttribute('style') || '',
    }
  }
}
ImageBlot.blotName = 'image'
ImageBlot.tagName = 'img'
Quill.register(ImageBlot)

import 'react-quill/dist/quill.snow.css'
import './Editor.css'

interface Props {
  quillRef: MutableRefObject<ReactQuill | null>
  value: string | undefined
  onChange: (content: string, delta: any, source: string, editor: any) => void
}

export default function Editor({ quillRef, value, onChange }: Props) {
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUD_PRESET as string
    )
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/upload`,
      { method: 'POST', body: formData }
    )
    const data = await res.json()
    return data.url
  }

  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0]
        const url = await uploadToCloudinary(file)
        const quill = quillRef.current
        if (quill) {
          const range = quill.getEditor().getSelection()
          if (range) {
            quill.getEditor().insertEmbed(range.index, 'image', {
              alt: 'Uploaded Image',
              url,
              width: 'auto',
              height: 'auto',
              style: 'max-width: 100%;',
            })
          }
        }
      }
    }
  }, [quillRef])

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ size: fontSizeArr }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'video'],
          [{ align: [] }],
          [{ color: [] }],
          ['code-block'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize'],
      },
    }
  }, [imageHandler])

  const quillFormats = [
    'header',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'align',
    'color',
    'code-block',
    'video',
    'alt',
    'height',
    'width',
    'style',
  ]

  return (
    <ReactQuill
      ref={quillRef}
      className="w-full h-[70%] mt-10 bg-white"
      modules={modules}
      value={value}
      onChange={onChange}
      formats={quillFormats}
    />
  )
}
