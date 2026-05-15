import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { useUpload } from "@workspace/object-storage-web";
import { resolveImageUrl, objectPathToServedUrl } from "@/lib/imageUrl";

const ACCEPT = "image/jpeg,image/png,image/webp,image/jpg";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
}

export function ImageUploadField({ label, value, onChange, helperText }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: (r) => {
      onChange(objectPathToServedUrl(r.objectPath));
      setErrorMsg(null);
    },
    onError: (e) => setErrorMsg(e.message),
  });

  function validate(file: File) {
    if (!/^image\/(jpe?g|png|webp)$/i.test(file.type)) {
      setErrorMsg("Only JPG, PNG, or WEBP images are allowed.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image must be smaller than 10 MB.");
      return false;
    }
    return true;
  }

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file || !validate(file)) return;
    await uploadFile(file);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function onSelect(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    e.target.value = "";
  }

  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border border-dashed transition-colors p-4 ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-white/15 bg-black/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={onSelect}
          className="hidden"
        />

        {value ? (
          <div className="flex items-start gap-4">
            <div className="w-32 h-24 bg-black border border-white/10 overflow-hidden flex-shrink-0">
              <img
                src={resolveImageUrl(value)}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400 mb-2 truncate" title={value}>
                {value}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 text-[10px] uppercase tracking-wider border border-white/15 text-gray-300 hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  {isUploading ? (
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> {progress}%
                    </span>
                  ) : (
                    "Replace"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-3 py-1.5 text-[10px] uppercase tracking-wider border border-red-500/30 text-red-400 hover:border-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex flex-col items-center justify-center py-6 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                <span className="text-xs uppercase tracking-wider">
                  Uploading {progress}%
                </span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs uppercase tracking-wider">
                  Click or drop image
                </span>
                <span className="text-[10px] text-gray-500 mt-1">
                  JPG · PNG · WEBP · max 10MB
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {helperText && (
        <p className="mt-1 text-[10px] text-gray-500">{helperText}</p>
      )}
      {errorMsg && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" /> {errorMsg}
        </p>
      )}
    </div>
  );
}
