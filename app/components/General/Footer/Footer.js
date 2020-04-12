import React from 'react';
import { Button, Col, Layout } from 'antd';
// import Player from '../../player/Player';
import CoolMusicPlayer from 'react-cool-music-player';
// import 'react-cool-music-player/dist/index.css';

const { Footer } = Layout;
const AppFooter = (props) => {
  let { list } = props;

  return <Footer style={{ textAlign: 'center', height: '80px' }}>
    <CoolMusicPlayer
      playListPlaceholder={'No Data'}
      // onDelete={onDelete}
      data={list}
      icons={{
        playIcon: <Button type="primary" shape="circle" icon="undo" onClick={props.player.status}/>,
        pauseIcon: <Button type="primary" shape="circle" icon="undo" onClick={props.player.status}/>,
        prevIcon: <Button type="primary" shape="circle" icon="play-circle"/>,
        nextIcon: <Button type="primary" shape="circle" icon="redo"/>
      }}
      currentAudio={props.player.current}
      play={props.player.play}
      showLyricNormal={true}
      showDetailLyric={true}
      // onAudioChange={onAudioChange}
      // onVolumeChange={onVolumeChange}
      // lyric={lyric}
      // tLyric={tLyric}
      // lyricLoading={lyricLoading}
      // playListAudioActions={playListAudioActions}
      // actions={actions}
      // volume={volumeValue}
      detailBackground={<div className={'blur-filter'}></div>}
      // playListHeader={{
      //   headerLeft: 'Play List',
      //   headerRight: <span onClick={onPlayListHide} className={'close-play-list'}>Close</span>
      // }}
      // onModeChange={(currentMode: PlayModeTypes, prevMode: PlayModeTypes) => {
      //   console.log('currentMode:', currentMode, 'prevMode:', prevMode)
      //   setCurrentPlayMode(currentMode)
      // }}
      // onPlayStatusChange={(currentAudio: IAudio, isPlayed: boolean) => {
      //   // console.log('currentAudio:', currentAudio, 'isPlayed:', isPlayed)
      //   setPlaying(isPlayed)
      // }}
      showPlayDetail={false}
      showLyricMini={true}
      playListShow={false}
      playDetailShow={false}
      // onPlayListStatusChange={(status: boolean) => {
      //   setPlayListShow(status)
      // }}
      // onPlayDetailStatusChange={(status: boolean) => {
      //   setPlayDetailShow(status)
      // }}
      // playMode={playMode}
      // detailActionTopRight={detailActionTopRight}
      // detailActionsBottom={detailActionsBottom}
    />
  </Footer>;
};
export default AppFooter;
