import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import Score from '@/components/respository/Score';

import { recordGoGithub } from '@/services/repository';
import { format } from '@/utils/day';

import { RepositoryProps } from '@/types/reppsitory';

const Info: NextPage<RepositoryProps> = ({ repo }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const checkMobile = () => {
    if (
      navigator.userAgent.match(/Mobi/i) ||
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPhone/i)
    ) {
      setIsMobile(true);
    }
  };

  const onClickLink = (rid: string) => {
    checkMobile();
    // 调用接口记录链接点击信息
    recordGoGithub(rid);
  };

  return (
    <div className='flex-cloume flex '>
      <div className='max-h-full w-9/12 max-w-full'>
        <div className='relative h-full p-2'>
          <div className='w-full text-lg line-clamp-3 dark:text-gray-300 lg:text-2xl lg:line-clamp-2'>
            <Link href={repo.url}>
              <a
                className='hover:text-blue-500 dark:hover:text-blue-500'
                onClick={() => onClickLink(repo.rid)}
                target={isMobile ? '_self' : '_blank'}
              >
                {repo.name}
              </a>
            </Link>
            ：{repo.title}
          </div>
          <div className='mt-1 mr-1 flex flex-wrap text-gray-500 dark:text-gray-400 lg:mr-2'>
            <div className='mt-1 hidden text-sm lg:mr-2 lg:block lg:text-base'>
              作者 {repo.author}
              <span className='pl-1 pr-1'>·</span>
              创建于 {format(repo.repo_created_at)}
            </div>
            {repo.volume_name ? (
              <Link href={`/periodical/volume/${Number(repo.volume_name)}`}>
                <a onClick={checkMobile} target={isMobile ? '_self' : '_blank'}>
                  <div className='mt-1 mr-1 flex h-6 cursor-pointer items-center rounded border border-current px-2.5 text-xs font-medium hover:text-blue-500 dark:hover:text-gray-500 lg:mr-2'>
                    第 {repo.volume_name} 期
                  </div>
                </a>
              </Link>
            ) : (
              <></>
            )}

            {repo.tags.map((item) => (
              <Link href={`/tags/${item.tid}/`} key={item.tid}>
                <a onClick={checkMobile} target={isMobile ? '_self' : '_blank'}>
                  <div className='mr-1 mt-1 flex h-6 cursor-pointer items-center rounded border border-current px-2.5 text-xs font-medium hover:text-blue-500 dark:hover:text-gray-500 lg:mr-2'>
                    {item.name}
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Score repo={repo}></Score>
    </div>
  );
};

export default Info;
