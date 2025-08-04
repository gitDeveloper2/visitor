"use client"
/** @jsxImportSource @emotion/react */
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const QuillEditorWrapper = forwardRef((props: any, ref: any) => {
  const { value, onChange, modules, formats } = props;
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor()
  }));

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      theme="snow"
      modules={modules}
      formats={formats}
    />
  );
});


export default QuillEditorWrapper;
