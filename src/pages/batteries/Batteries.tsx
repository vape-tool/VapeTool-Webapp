import React from 'react';
import AutoSizer, { Size } from 'react-virtualized-auto-sizer';
import { connect } from 'dva';
import { CellMeasurerCache } from 'react-virtualized';
import { FixedSizeGrid, GridChildComponentProps } from 'react-window';
import { ConnectProps, ConnectState } from '@/models/connect';
import BatteryView from '@/components/BatteryView';
import { Battery } from '@/types/battery';

interface BatteriesComponentProps extends ConnectProps {
  batteries: Battery[];
}

interface BatteriesComponentState {
  columnWidth: number;
  rowHeight: number;
  gutterSize: number;
  columnCount: number;
}

class Batteries extends React.PureComponent<BatteriesComponentProps, BatteriesComponentState> {
  gridWidth: number = 0;

  cache: CellMeasurerCache = new CellMeasurerCache({
    defaultHeight: 300,
    defaultWidth: 300,
    fixedWidth: true,
  });

  state: BatteriesComponentState = {
    columnWidth: 300,
    rowHeight: 300,
    gutterSize: 10,
    columnCount: 0,
  };

  public render() {
    return <AutoSizer onResize={this.onResize}>{this.renderGrid}</AutoSizer>;
  }

  private onResize = ({ width }: Size) => {
    this.gridWidth = width;
    this.calculateColumnCount();
  };

  private calculateColumnCount = () => {
    const { columnWidth, gutterSize } = this.state;
    const columnCount = Math.floor(this.gridWidth / (columnWidth + gutterSize));
    console.log(`columnCount: ${columnCount}`);
    this.setState({ columnCount });
  };

  private renderGrid = ({ width, height }: Size) => {
    this.gridWidth = width;
    const { columnWidth, rowHeight, columnCount } = this.state;

    console.log(`render grid of dimensions ${width}x${height}`);
    const { batteries } = this.props;
    const rowCount = Math.ceil(batteries.length / columnCount);
    const getBattery = (columnIndex: number, rowIndex: number) =>
      batteries[(rowIndex * columnCount + columnIndex) % batteries.length];
    return (
      <FixedSizeGrid
        columnCount={columnCount}
        columnWidth={columnWidth}
        width={width}
        height={height}
        rowCount={rowCount}
        rowHeight={rowHeight}
      >
        {({ columnIndex, rowIndex, style }: GridChildComponentProps) => (
          <div style={{ ...style }}>
            <BatteryView
              height={rowHeight}
              width={columnWidth}
              battery={getBattery(columnIndex, rowIndex)}
            />
          </div>
        )}
      </FixedSizeGrid>
    );
  };
}

export default connect(({ batteries: { batteries } }: ConnectState) => ({ batteries }))(Batteries);
