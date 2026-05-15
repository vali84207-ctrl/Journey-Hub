import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { useUpload } from "@workspace/object-storage-web";
import { resolveImageUrl, objectPathToServedUrl } from "@/lib/imageUrl";

const ACCEPT = "image/jpeg,image/png,image/webp,image/jpg";

interface Props {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  helperText?: string;
}

export function GalleryUploadField({ label, value, onChange, helperText }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(0);
  const { uploadFile } = useUpload();

  function validate(file: File): boolean {
    if (!/^image\/(jpe?g|png|webp)$/i.test(file.type)) {
      setErrorMsg(`${file.name}: only JPG, PNG, or WEBP allowed.`);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(`${file.name}: must be smaller than 10 MB.`);
      return false;
    }
    return true;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setErrorMsg(null);
    const valid = Array.from(files).filter(validate);
    if (!valid.length) return;
    setPending(valid.length);
    const uploaded: string[] = [];
    for (const f of valid) {
      const r = await uploadFile(f);
      if (r) uploaded.push(objectPathToServedUrl(r.objectPath));
      setPending((p) => p - 1);
    }
    if (uploaded.length) onChange([...value, ...uploaded]);
  }

  function onSelect(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
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
        className={`border border-dashed transition-colors p-3 ${
          dragOver ? "border-primary bg-primary/5" : "border-white/15 bg-black/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          onChange={onSelect}
          className="hidden"
        />

        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
            {value.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative group aspect-[4/3] bg-black border border-white/10 overflow-hidden"
              >
                <img
                  src={resolveImageUrl(src)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="p-1.5 bg-white/10 hover:bg-primary text-white disabled:opacity-30"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    className="p-1.5 bg-white/10 hover:bg-primary text-white disabled:opacity-30"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending > 0}
          className="w-full flex flex-col items-center justify-center py-4 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
        >
          {pending > 0 ? (
            <>
              <Loader2 className="w-5 h-5 mb-1 animate-spin" />
              <span className="text-xs uppercase tracking-wider">
                Uploading {pending} image{pending > 1 ? "s" : ""}...
              </span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-xs uppercase tracking-wider">
                Click or drop images
              </span>
              <span className="text-[10px] text-gray-500 mt-1">
                Multiple · JPG · PNG · WEBP · max 10MB each
              </span>
            </>
          )}
        </button>
      </div>

      {helperText && (
        <p className="mt-1 text-[10px] text-gray-500">{helperText}</p>
      )}
      {errorMsg && <p className="mt-1 text-xs text-red-400">{errorMsg}</p>}
    </div>
  );
}
