import { cn } from "@/lib/utils"
import { Img } from "react-image"
import { FadeLoader } from "react-spinners"

const Image = (props: { src: string, width?: number, height?: number, className?: string, alt?: string }) => {

  return (
    <div className={cn("flex relative items-center", props.className)}>
      <Img
        {...props}
        loader={
          <FadeLoader
            color="#414040"
            loading={true}
            cssOverride={{ margin: "auto" }}
          />
        }
      />
    </div>
  )
}
export default Image