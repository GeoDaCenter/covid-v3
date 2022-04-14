export const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
  const handleFileInput = (e) => {
    // handle validations
    const file = e.target.files[0];
    if (!file.name.includes("json")) {
      onFileSelectError({ error: "File must be GeoJSON." });
    } else {
      onFileSelectSuccess(file);
    }
  };

  return <input type="file" onChange={handleFileInput} />;
};
