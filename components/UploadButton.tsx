'use client'

import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Cloud, File, Loader2 } from 'lucide-react'
import { set } from 'date-fns'
import { useRouter } from 'next/navigation'

import { useUploadThing } from '@/lib/uploadthing'
import { trpc } from '@/app/_trpc/client'

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { useToast } from './ui/use-toast'

const UploadDropzone = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [upLoadProgress, setUpLoadProgress] = useState<number>(0)

  const { startUpload } = useUploadThing('pdfUploader')

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`)
    },
    retry: true,
    retryDelay: 500
  })

  const startSimulatedUpload = () => {
    setUpLoadProgress(0)

    const interval = setInterval(() => {
      setUpLoadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          setIsUploading(false)

          return prev
        }

        return prev + 5
      })
    }, 500)

    return interval
  }

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true)
        const preogressInterval = startSimulatedUpload()

        // handle file uploading

        const res = await startUpload(acceptedFile)

        if (!res) {
          return toast({
            title: 'Something went wrong',
            description: 'Please try again later',
            variant: 'destructive'
          })
        }

        const [fileResponse] = res

        const key = fileResponse?.key

        if (!key) {
          return toast({
            title: 'Something went wrong',
            description: 'Please try again later',
            variant: 'destructive'
          })
        }

        clearInterval(preogressInterval)
        setUpLoadProgress(100)
        startPolling({ key })
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-200 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              htmlFor="dropzone-file"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-zinc-500">PDF (up to 4mb)</p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">{acceptedFiles[0].name}</div>
                </div>
              ) : null}
              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    className="h-1 w-full bg-zinc-200"
                    indicatorColor={upLoadProgress === 100 ? 'bg-green-500' : ''}
                    value={upLoadProgress}
                  />
                  {upLoadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Redirecting...</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <input className="hidden" {...getInputProps} id="dropzone-file" type="file" />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  )
}
const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  )
}

export default UploadButton
