import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaPen } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/server/axios";
import { toast } from "sonner";
import { getUserRole } from "@/utils/getUserRole";
const StatusDetail = ({ details }) => {
  const userRole = getUserRole();
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");

  const [editedDetails, setEditedDetails] = useState(details);

  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...editedDetails];
    updatedDetails[index][field] = value;
    setEditedDetails(updatedDetails);
  };

  const handleSave = async () => {
    try {
      for (const detail of editedDetails) {
        const response = await axiosInstance.put(
          `/api/transaction/update-detail/${detail.id}`,
          {
            health: detail.health,
            sick: detail.sick,
            death: detail.death,
          }
        );
        console.log(response.data.data);
      }
      toast.success("Details updated successfully");
      setIsEdit(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message); // Set pesan error dari server
      } else {
        setError("An unexpected error occurred");
      }
      toast.error("Failed to update details");
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger className="px-2 py-2 text-white rounded-md bg-green-600 hover:bg-green-800">
          See Detail
        </DialogTrigger>
        <DialogContent>
          <DialogHeader
            className={"flex flex-row align-middle items-center gap-2"}
          >
            <DialogTitle>Detail Status</DialogTitle>
            {userRole == "seller" && (
              <Button
                size={"icon"}
                variant="ghost"
                onClick={() => setIsEdit(!isEdit)}
              >
                <FaPen />
              </Button>
            )}
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Healty</TableHead>
                <TableHead>Sick</TableHead>
                <TableHead>Death</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedDetails.map((detail, i) =>
                !isEdit ? (
                  <TableRow key={i}>
                    <TableCell>{detail.health}</TableCell>
                    <TableCell>{detail.sick}</TableCell>
                    <TableCell>{detail.death}</TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={i}>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={detail.health}
                        onChange={(e) =>
                          handleInputChange(
                            i,
                            "health",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={detail.sick}
                        onChange={(e) =>
                          handleInputChange(i, "sick", parseInt(e.target.value))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={detail.death}
                        onChange={(e) =>
                          handleInputChange(
                            i,
                            "death",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {!isEdit ? (
            ""
          ) : (
            <div className="flex gap-4`">
              <Button
                onClick={handleSave}
                className="bg-green-600 mr-3"
                Type="submit"
              >
                Save
              </Button>
              <Button onClick={() => setIsEdit(false)} variant={"outline"}>
                Cancel
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StatusDetail;
