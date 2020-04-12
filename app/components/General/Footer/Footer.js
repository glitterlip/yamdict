import React, { Component } from 'react';
import { Button, Col, Layout } from 'antd';
import CoolMusicPlayer from 'react-cool-music-player';

const { Footer } = Layout;
type Props = {};

export default class AppFooter extends Component<Props> {
  props: Props;

  constructor() {
    super();
  }

  render() {

    return <Footer style={{ textAlign: 'center', height: '80px' }}>
      <CoolMusicPlayer
        playListPlaceholder={'No Data'}
        // onDelete={onDelete}
        data={this.props.player.list}
        icons={{
          playIcon: <Button type="primary" shape="circle" icon="play-circle" onClick={this.props.player.status}/>,
          pauseIcon: <Button type="primary" shape="circle" icon="play-circle" onClick={this.props.player.status}/>,
          prevIcon: <Button type="primary" shape="circle" icon="undo"/>,
          nextIcon: <Button type="primary" shape="circle" icon="redo"/>
        }}
        currentAudio={this.props.player.current}
        play={this.props.player.play}
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
  }
};
