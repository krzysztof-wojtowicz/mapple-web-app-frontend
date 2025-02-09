import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

function Previews({ handleImage, checkHeight, setErrorFile }) {
  const [isUploadImage, setIsUploadImage] = useState(false);
  //   const [isUploadPost, setUploadPost] = useState(false);
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setIsUploadImage(true);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(()=>{
    if(fileRejections.length>0){
      setErrorFile("File has to be an image!")
      setIsUploadImage(false)
    }
  },[fileRejections])

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          src={file.preview}
          className="object-cover"
          // Revoke data uri after image is loaded
          onLoad={() => {
            handleImage(file);
            checkHeight();
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="">
      <div className="">
        <div
          {...getRootProps({
            className:
              "flex justify-center items-center rounded-lg border-dashed border-2 border-gray-300 dark:border-zinc-600 min-h-[8rem]",
          })}
        >
          <input type="file" name="myFile" {...getInputProps()} />
          <div>
            {!isUploadImage && (
              <span className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-600 dark:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="font-medium text-gray-600 dark:text-white">
                  Drop files to Attach
                </span>
              </span>
            )}
          </div>
          <aside className="flex items-center p-3">{thumbs}</aside>
        </div>
      </div>
    </section>
  );
}
export default Previews;
