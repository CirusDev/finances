import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useCSVReader } from "react-papaparse"

type Props = {
  onUpload: (results: any) => void
}

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader} = useCSVReader()

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button
          className="w-full lg:w-auto"
          size={"sm"}
          {...getRootProps()}
        >
          <Upload className="mr-2 h-4 w-4" />

          Upload CSV
        </Button>
      )}

    </CSVReader>
  )
}
