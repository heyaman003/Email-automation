
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bold, Italic, Underline, Link, Paperclip, FileSpreadsheet } from "lucide-react"
import { sendEmail } from "../actions/sendEmail"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import defaultContent from '../data/emailtemplate';
import * as XLSX from 'xlsx';


export default function EmailSender() {
  
  const [content, setContent] = useState(defaultContent)
  const [files, setFiles] = useState([])
  const [excelFile, setExcelFile] = useState(null)
  const [recipients, setRecipients] = useState([])
  const [isPending, setIsPending] = useState(false);
  const [subject, setSubject] = useState("");
  const contentEditableRef = useRef(null)
  const fileInputRef = useRef(null)
  const excelInputRef = useRef(null)

  const handleFormat = (command) => {
    document.execCommand(command, false, undefined)
    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.innerHTML
      if (newContent !== content) {
        setContent(newContent)
      }
    }
  }

  const handleInsertLink = () => {
    const url = prompt("Enter the URL:")
    if (url) {
      document.execCommand("createLink", false, url)
      if (contentEditableRef.current) {
        setContent(contentEditableRef.current.innerHTML)
      }
    }
  }

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files])
  }

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
        setExcelFile(file);  // Set the Excel file
        console.log("The file is", file);
        
        // Read the file as ArrayBuffer
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const data = event.target.result;
            console.log("The data is", data);
            
            // Parse the data using XLSX
            const workbook = XLSX.read(data, { type: 'array' }); // Use 'array' instead of 'binary'
            
            // Log all sheet names in the workbook to check
            const sheetNames = workbook.SheetNames;
            console.log("Sheet names in the workbook:", sheetNames);
            
            // Check if 'Sheet1' exists, or if the sheet name is different
            const sheetName = sheetNames[0];  // Assuming the first sheet is the one you want to use
            const sheet = workbook.Sheets[sheetName];
            console.log("Sheet data:", sheet);

            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' }); // Use defval to handle undefined cells
            console.log("Parsed JSON data:", jsonData);

            // Ensure columns are being read properly
            const recipientsFromExcel = jsonData.map((row) => ({
                name: row.Name?.trim(),      // Use optional chaining and trim whitespace
                email: row.Email?.trim()     // Use optional chaining and trim whitespace
            }));

            console.log("Recipients from Excel:", recipientsFromExcel);
            
            // Simulating backend processing with a delay
            setTimeout(() => {
                setRecipients(recipientsFromExcel);
            }, 1000);
        };
        
        reader.readAsArrayBuffer(file);  // Use readAsArrayBuffer instead of readAsBinaryString
    }
};




  useEffect(() => {
    if (contentEditableRef.current) {
      const refContent = contentEditableRef.current.innerHTML
      if (refContent !== content) {
        contentEditableRef.current.innerHTML = content
      }
    }
  }, [content])

  const handleContentChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
  
    const formData = new FormData(e.target);
    formData.append("recipients", JSON.stringify(recipients));
    formData.append("subject", subject);
    formData.append("content", content);
    formData.append("credinitals", localStorage.getItem('credinitals'));
     // Append selected files to FormData
     console.log("the credinitals is ",typeof(localStorage.getItem('credinitals')));
     files.forEach((file, index) => {
      formData.append(`attachments`, file);
  });
  
     
    console.log("Form Data before sending:", formData,formData.get("recipients"),formData.get("subject"),formData.get("content"));

    // if (excelFile) {
    //   formData.append("excelfile", excelFile);
    // }
    console.log("The form data is", formData);
    try {
      const response = await fetch("/automation/send-email", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert("Error sending emails: " + error.message);
    } finally {
      setIsPending(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl mx-auto">
      <div>
        <Label htmlFor="excel-upload">Upload Recipients Excel File:</Label>
        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" onClick={() => excelInputRef.current.click()}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Upload Excel
          </Button>
          <input
            type="file"
            id="excel-upload"
            ref={excelInputRef}
            onChange={handleExcelFileChange}
            accept=".xlsx, .xls"
            className="hidden"
          />
          {excelFile && <span>{excelFile.name}</span>}
        </div>
      </div>
      {recipients.length > 0 && (
        <Alert>
          <AlertTitle>Recipients Loaded</AlertTitle>
          <AlertDescription>{recipients.length} recipients extracted from Excel file.</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="subject">Subject:</Label>
        <Input onChange={(e)=>setSubject(e.target.value)} type="text" id="subject" name="subject" defaultValue="Annual Report - Important Updates" required />
      </div>
      <div>
        <Label htmlFor="content">Content:</Label>
        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-100 p-2 flex space-x-2">
            <Button type="button" variant="outline" size="icon" onClick={() => handleFormat("bold")}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => handleFormat("italic")}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => handleFormat("underline")}>
              <Underline className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={handleInsertLink}>
              <Link className="h-4 w-4" />
            </Button>
          </div>
          <div
            ref={contentEditableRef}
            contentEditable
            className="p-2 min-h-[200px]"
            onInput={handleContentChange}
            // dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <input type="hidden" name="content" value={content} />
      </div>
      <div>
        <Label htmlFor="attachments">Attachments:</Label>
        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()}>
            <Paperclip className="h-4 w-4 mr-2" />
            Attach Files
          </Button>
          <input
            type="file"
            id="attachments"
            name="attachments"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                View Attachments
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Attached Files</DialogTitle>
              </DialogHeader>
              <ul className="list-disc pl-4">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Button type="submit" disabled={isPending || recipients.length === 0}>
        {isPending ? "Sending..." : `Send Email to ${recipients.length} Recipients`}
      </Button>
    </form>
  )
}

