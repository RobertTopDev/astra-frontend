import { TLaunchpadDetailInfo } from '@/types'

interface Props {
  data: TLaunchpadDetailInfo | undefined
}

export default function ProjectDetail({ data }: Props) {
  return <div>{data && data.PROJECT_DETAIL}</div>
}
