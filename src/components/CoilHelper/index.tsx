import React from 'react';
import { Carousel, Modal, Button } from 'antd';
import ImageWebp from '../ImageWebp';
import innerDiameterPng from '../../assets/innerCoilDiameter.png';
import coilLegsLength from '../../assets/coilLegsLength.png';
import coilWraps from '../../assets/coilWraps.png';

export default function CoilHelper(props: any) {
  return (
    <Modal
      style={{ top: 20 }}
      title="Help"
      visible={props.helpModalVisibile}
      onCancel={() => props.setHelpModalVisible(false)}
      footer={[
        <Button
          key="back"
          type="primary"
          onClick={() =>
            props.slider
              ? props.slider.prev()
              : console.error('Please restart page, something went wrong')
          }
        >
          Previous
        </Button>,
        <Button
          key="next"
          type="primary"
          onClick={() =>
            props.slider
              ? props.slider.next()
              : console.error('Please restart page, something went wrong')
          }
        >
          Next
        </Button>,
      ]}
      // onOk={this.handleOk}
      // onCancel={this.handleCancel}
    >
      <Carousel
        dots={false}
        arrows
        adaptiveHeight
        draggable
        swipeToSlide
        touchMove
        ref={c => props.setSlider(c)}
      >
        <div>
          <div style={{ height: '14em' }}>
            <h1>Inner coil diameter</h1>
            <h3>This is diameter of drill on which you are wrapping your coil</h3>
          </div>
          <ImageWebp
            png={innerDiameterPng}
            style={{
              width: '100%',
            }}
            alt="Ohm Law formulas"
          />
        </div>
        <div>
          <div style={{ height: '14em' }}>
            <h1>Legs length</h1>
            <h3>
              Legs Length is the wire length between wraps on coil edge and pins in atomizer.
              Remember to enter length of both legs, like on picture abovel
            </h3>
          </div>
          <ImageWebp
            png={coilLegsLength}
            style={{
              width: '100%',
            }}
            alt="Ohm Law formulas"
          />
        </div>
        <div>
          <div style={{ height: '14em' }}>
            <h1>Number of wraps</h1>
            <h3>
              If legs go in the same direction (In most RDAs), there are two half wraps on both coil
              edges, so they are also counted in half. In picture above there are 5 wraps, not 6 !
              (4 full wraps, and 2 half wraps)
            </h3>
          </div>
          <ImageWebp
            png={coilWraps}
            style={{
              width: '100%',
            }}
            alt="Ohm Law formulas"
          />
        </div>
      </Carousel>
    </Modal>
  );
}
