import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import moment from "moment";
import { formatPrice } from "@/utils/priceFormatter";

const TransactionDetail = ({
  paymentMethod,
  totalPrice,
  qty,
  transactionDate,
  fieldName,
  sellerName,
  duration,
  type,
  city,
  address,
}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="px-4 py-2 text-white rounded-md bg-green-600 hover:bg-green-800">
          See Detail
        </DialogTrigger>
        <DialogContent>
          <DialogHeader
            className={"flex flex-row align-middle items-center gap-2"}
          >
            <DialogTitle className="text-xl">Detail Status</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between">
            <div className="kiri">
              <h3>Transaction Date</h3>
            </div>
            <div className="kiri text-right">
              <h3>
                {moment(transactionDate).format("dddd DD MMMM  YYYY, h:mm a")}
              </h3>
            </div>
          </div>
          <h1 className="text-md font-bold ">Detail Product</h1>
          <div className="flex justify-between">
            <div className="kiri">
              <h3>Field</h3>
              <h3>Type</h3>
              <h3 className="font-bold mt-2">Address</h3>
              <h3>
                {city}, {address}
              </h3>
            </div>
            <div className="kiri text-right">
              <h3>{fieldName}</h3>
              <h3>{type}</h3>
            </div>
          </div>
          <h1 className="text-md font-bold ">Rent Detail</h1>
          <div className="flex justify-between">
            <div className="kiri">
              <h3>Animal Qty</h3>
              <h3>Rent Duration (month)</h3>
            </div>
            <div className="kiri">
              <h3>{qty}</h3>
              <h3>{duration}</h3>
            </div>
          </div>

          <h1 className="text-md font-bold ">Rincian Pembayaran</h1>
          <div className="flex justify-between">
            <div className="kiri">
              <h3>Metode Pembayaran</h3>
              <h3>Sub Total Harga Barang</h3>
            </div>
            <div className="kiri text-right">
              <h3>{paymentMethod}</h3>
              <h3>Rp. {formatPrice(Number(totalPrice))}</h3>
            </div>
          </div>
          <div className="flex justify-between">
            <h1 className="text-xl font-bold mt-10 mb-2">Total</h1>
            <h1 className="text-xl font-bold mt-10 mb-2">
              Rp. {formatPrice(Number(totalPrice))}
            </h1>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionDetail;
