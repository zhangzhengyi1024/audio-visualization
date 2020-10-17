import React, { Component, createRef } from 'react';
import { drawFrequencyHistogram, getCanvasAndContext } from '../utils';

interface FrequencyCanvasProps {
  analyser: AnalyserNode;
  play: boolean;
}

class FrequencyCanvas extends Component<FrequencyCanvasProps> {
  private ref = createRef<HTMLCanvasElement>();
  private dataBuffer: Uint8Array;
  private drawHandler: number | null = null;
  private width = 1320;
  private height = 400;

  constructor(props: FrequencyCanvasProps) {
    super(props);
    this.dataBuffer = new Uint8Array(props.analyser.frequencyBinCount);
  }

  componentDidUpdate(prevProps: FrequencyCanvasProps) {
    const { play } = this.props;

    if (prevProps.play !== play) {
      if (play) {
        const result = getCanvasAndContext(this.ref);
        if (!result) return;

        const { canvas, ctx } = result;

        const draw = () => {
          this.props.analyser.getByteFrequencyData(this.dataBuffer);

          drawFrequencyHistogram(ctx, canvas, this.dataBuffer);
          this.drawHandler = window.requestAnimationFrame(draw);
        };

        this.drawHandler = window.requestAnimationFrame(draw);
      } else if (this.drawHandler) {
        window.cancelAnimationFrame(this.drawHandler);
        this.drawHandler = null;
      }
    }
  }

  render() {
    const { width, height } = this;
    return (
      <canvas
        className="frequency"
        ref={this.ref}
        width={width}
        height={height}
      ></canvas>
    );
  }
}

export default FrequencyCanvas;
