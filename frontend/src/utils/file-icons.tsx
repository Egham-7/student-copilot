import {
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFileText,
  AiOutlineFile,
} from 'react-icons/ai';

export function getFileIcon(type: string) {
  if (type.includes('pdf'))
    return <AiOutlineFilePdf className="w-4 h-4 text-red-500" />;
  if (type.includes('image'))
    return <AiOutlineFileImage className="w-4 h-4 text-blue-400" />;
  if (type.includes('word'))
    return <AiOutlineFileWord className="w-4 h-4 text-blue-600" />;
  if (type.includes('excel'))
    return <AiOutlineFileExcel className="w-4 h-4 text-green-600" />;
  if (type.includes('text'))
    return <AiOutlineFileText className="w-4 h-4 text-gray-500" />;
  return <AiOutlineFile className="w-4 h-4 text-muted-foreground" />;
}
