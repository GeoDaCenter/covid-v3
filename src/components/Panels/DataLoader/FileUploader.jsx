/**
 * Helper component for uploading files
 *
 * @category Components/DataLoader
 * @example
 *     function MyComponent() {
 *         const [file, setFile] = useState(null)
 *         const [error, setError] = useState({ error: null })
 *         return (
 *             <FileUploader
 *                 onFileSelectSuccess={setFile}
 *                 onFileSelectError={setError}
 *             />
 *         )
 *     }
 *
 * @param {Object} props
 * @param {function} props.onFileSelectSuccess Callback function for file
 *   success. Uses the first File in the input (file: File) => void See more on
 *   File at https://developer.mozilla.org/en-US/docs/Web/API/File
 * @param {function} props.onFileSelectError Callback function for error.
 *   ({error: "error message"}) => void
 */
export const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
    const handleFileInput = (e) => {
        // handle validations
        const file = e.target.files[0]
        if (!file.name.includes('json')) {
            onFileSelectError({ error: 'File must be GeoJSON.' })
        } else {
            onFileSelectSuccess(file)
        }
    }

    return (
        <input
            aria-labelledby="filename-label"
            type="file"
            onChange={handleFileInput}
        />
    )
}
