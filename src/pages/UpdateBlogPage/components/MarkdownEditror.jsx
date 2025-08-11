import React from "react";
import MDEditor from '@uiw/react-md-editor';

export default function MarkdownEditor({value,setValue}) { 
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
        data-color-mode="dark"
       className="!bg-main"
            extraCommands={[]} 
      />
      <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
}