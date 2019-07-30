import { Wire, WiresTree, WireType } from '@/types/wire';
import uuid from '@/utils/uuid';
import { Cloud, LOCAL_AUTHOR, OnlineStatus, Storeable } from '@/types/cloud';

export class Coil implements Storeable, WiresTree {
  uid: string;

  name: string;

  description: string;

  author: Cloud;

  creationTime: number;

  lastTimeModified: number;

  status: OnlineStatus;

  type: WireType;

  setup: number;

  wraps: number;

  resistance: number;

  legsLength: number;

  innerDiameter: number;

  pitch: number;

  heightDiameter: number;

  widthDiameter: number;

  cores: Wire[];

  outers: Wire[];

  constructor(uid: string = uuid(), name: string = '', description: string = '', author: Cloud = LOCAL_AUTHOR,
              creationTime: number = Date.now(), lastTimeModified: number = Date.now(),
              status: OnlineStatus = OnlineStatus.ONLINE_PUBLIC, type: WireType = WireType.NORMAL,
              setup: number = 1, wraps: number = 0.0, resistance: number = 0.0,
              legsLength: number = 15.0, innerDiameter: number = 0.0, pitch: number = 0.0,
              heightDiameter: number = 0.0, widthDiameter: number = 0.0,
              cores: Wire[] = [], outers: Wire[] = []) {
    this.setup = setup;
    this.name = name;
    this.description = description;
    this.wraps = wraps;
    this.resistance = resistance;
    this.legsLength = legsLength;
    this.type = type;
    this.author = author;
    this.creationTime = creationTime;
    this.lastTimeModified = lastTimeModified;
    this.status = status;
    this.uid = uid;
    this.cores = cores;
    this.outers = outers;
    this.innerDiameter = innerDiameter;
    this.pitch = pitch;
    this.heightDiameter = heightDiameter;
    this.widthDiameter = widthDiameter;
  }
}
