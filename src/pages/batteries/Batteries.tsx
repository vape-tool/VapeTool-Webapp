import React from 'react';
import AutoSizer, { Size } from 'react-virtualized-auto-sizer';
import { connect } from 'dva';
import { CellMeasurer, CellMeasurerCache, Masonry, MasonryCellProps, Positioner, } from 'react-virtualized';
import { createCellPositioner } from 'react-virtualized/dist/es/Masonry';
import { ConnectProps, ConnectState } from '@/models/connect';
import { BatteriesModelState } from '@/models/batteries';
import BatteryView from '@/components/BatteryView';

interface BatteriesComponentProps extends ConnectProps {
  batteries: BatteriesModelState;
}

interface BatteriesComponentState {
  columnWidth: number;
  gutterSize: number;
  overscanByPixels: number;
}

class Batteries extends React.PureComponent<BatteriesComponentProps, BatteriesComponentState> {
  width: number = 0;

  columnCount: number = 0;

  cache: CellMeasurerCache = new CellMeasurerCache({
    defaultHeight: 250,
    defaultWidth: 200,
    fixedWidth: true,
  });

  masonry?: any;

  cellPositioner?: Positioner;

  state: BatteriesComponentState = {
    columnWidth: 200,
    gutterSize: 10,
    overscanByPixels: 100,
  };

  constructor(props: BatteriesComponentProps) {
    super(props);
    this.cellRenderer = this.cellRenderer.bind(this);
    this.onResize = this.onResize.bind(this);
    this.renderMasonry = this.renderMasonry.bind(this);
    this.setMasonryRef = this.setMasonryRef.bind(this);
  }

  public render() {
    return <AutoSizer onResize={this.onResize}>{this.renderMasonry}</AutoSizer>;
  }

  private onResize({ width }: Size) {
    this.width = width;

    this.calculateColumnCount();
    this.resetCellPositioner();
    if (this.masonry) {
      this.masonry.clearCellPositions();
    }
  }

  private setMasonryRef(ref: any) {
    this.masonry = ref;
  }

  private resetCellPositioner() {
    const { columnWidth, gutterSize } = this.state;

    if (this.cellPositioner) {
      this.cellPositioner.reset({
        columnCount: this.columnCount,
        columnWidth,
        spacer: gutterSize,
      });
    }
  }

  private calculateColumnCount() {
    const { columnWidth, gutterSize } = this.state;

    this.columnCount = Math.floor(this.width / (columnWidth + gutterSize));
  }

  private cellRenderer({ index, key, parent, style }: MasonryCellProps) {
    const {
      batteries: { batteries },
    } = this.props;
    const { columnWidth } = this.state;

    const datum = batteries[index];
    console.log(`rendercell index: ${index} batteries.length: ${batteries.length} datum: ${datum}`);
    const height = (columnWidth * datum.imageHeight) / datum.imageWidth;

    return (
      <CellMeasurer cache={this.cache} index={index} key={key} parent={parent}>
        <div
          style={{
            ...style,
            width: columnWidth,
          }}
        >
          <BatteryView height={height} battery={datum}/>
        </div>
      </CellMeasurer>
    );
  }

  private renderMasonry({ width, height }: Size) {
    this.width = width;

    this.calculateColumnCount();

    if (typeof this.cellPositioner === 'undefined') {
      const { columnWidth, gutterSize } = this.state;

      this.cellPositioner = createCellPositioner({
        cellMeasurerCache: this.cache,
        columnCount: this.columnCount,
        columnWidth,
        spacer: gutterSize,
      });
    }

    const { overscanByPixels } = this.state;

    return (
      <Masonry
        autoHeight={false}
        cellCount={this.props.batteries.batteries.length}
        cellMeasurerCache={this.cache}
        cellPositioner={this.cellPositioner}
        cellRenderer={this.cellRenderer}
        height={height}
        overscanByPixels={overscanByPixels}
        ref={this.setMasonryRef}
        width={width}
      />
    );
  }
}

export default connect(({ batteries }: ConnectState) => ({ batteries }))(Batteries);
