import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { StreamingRoomItem } from '../../components/domain';
import { ServerStreamingRoom } from '../../types/streaming';

const Live: NextPage = () => {
  const [streamingData, setStreamingData] = useState<ServerStreamingRoom[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchStreamingData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ServerStreamingRoom[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/streaming`
      );
      setStreamingData([...response.data]);
    } catch (e) {
      setErrorMessage('서버와의 통신이 없습니다.');
      console.error(e);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStreamingData();

    //   const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/streaming`);

    //   socket.on('someone_start-broadcasting', () => {
    //     // someone start broadcasting, please click refresh button
    //     // 메세지 띄우기
    //   });
  }, []);

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <>
      <Head>
        <title>{'live'}</title>
      </Head>

      <div>현재 방송들 : {streamingData.length}개</div>
      <button onClick={fetchStreamingData} disabled={isLoading}>
        refresh
      </button>
      <Link href="/live/create">
        <button>create a room</button>
      </Link>

      <StyledStreamingRoomWrapper>
        {errorMessage ? (
          <div>{errorMessage}</div>
        ) : streamingData.length === 0 ? (
          <div>방송중인 사람이 없습니다</div>
        ) : (
          streamingData?.map((room) => (
            <StreamingRoomItem
              key={room._id}
              _id={room._id}
              roomName={room.roomName}
              roomUser={room.roomUser}
              streamer={room.streamer}
              isLive={room.isLive}
              thumbnailUrl="https://loremflickr.com/288/162"
              avatarUrl={'https://www.fillmurray.com/40/40'}
            />
          ))
        )}
      </StyledStreamingRoomWrapper>
    </>
  );
};

const StyledRoomContainer = styled.div``;

const StyledStreamingRoomWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default Live;
