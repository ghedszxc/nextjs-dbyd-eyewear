"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface VideoPlayerProps {
  src: string;
  className?: string;
}

const VideoPlayer = ({ src, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative h-full w-full">
      <video ref={videoRef} src={src} autoPlay muted loop playsInline className={className} />
      <div className="absolute bottom-8 left-8 flex items-center gap-4 rounded-full bg-[rgba(58,58,44,0.75)] px-4 py-2 backdrop-blur-[4px] lg:right-8 lg:left-auto">
        <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="cursor-pointer">
          {isPlaying ? (
            <Image src="/icons/video-pause-btn-light.svg" alt="Pause" width={24} height={24} />
          ) : (
            <Image src="/icons/video-play-btn-light.svg" alt="Play" width={24} height={24} />
          )}
        </button>
        <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="cursor-pointer">
          {isMuted ? <Image src="/icons/video-muted-light.svg" alt="Muted" width={24} height={24} /> : <Image src="/icons/video-unmuted-light.svg" alt="Unmuted" width={24} height={24} />}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
