import { District } from "./district";
import { Province } from "./province";
import { Ward } from "./ward";

export interface Address {
   id: number;
   province: Province;
   district: District;
   ward: Ward;
   street: string;
}