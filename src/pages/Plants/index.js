import React, { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Row } from "reactstrap";
import CustomModal from "../../components/Custome/CustomModal";
import Table from "../../components/Custome/table";
import useHttp from "../../components/Hook/Use-http";
import CONSTANT, {
  DeleteButton,
  EditButton,
  getTableData,
} from "../Utility/constnt";

const Plants = () => {
  const [showModel, setShowModel] = useState(false);
  const [plantData, setPlantData] = useState([]);
  const [actionData, setActionData] = useState({});
  const [confirm_both, setconfirm_both] = useState(false);
  const [flag, setFlag] = useState(true);
  const API_CALL = useHttp();

  useEffect(() => {
    (async () => {
      API_CALL.sendRequest(CONSTANT.API.getAllPlant, plantDataHandler);
      API_CALL.sendRequest(CONSTANT.API.getAllClient, clientDataHandler);
    })();
  }, []);

  const clientDataHandler = (res) => {
    CONSTANT.FORM_FIELDS.PLANT.push({
      name: "clientId",
      label: "Client Name",
      placeholder: "Client Name",
      type: "SingleSelect",
      options: res?.data.map((data) => {
        return { label: data.name, value: data.id };
      }),
    });
  };

  const plantDataHandler = (res) => {
    setPlantData(
      res?.data.map((plantData, index) => {
        return {
          ...plantData,
          no: index + 1,
          clientName: plantData.client.name,
          action: (
            <>
              <EditButton
                onClick={() => {
                  onEditPlan(plantData);
                }}
              />
              <DeleteButton
                onClick={() => {
                  openConfirmationDeleteModal(plantData);
                }}
              />
            </>
          ),
        };
      })
    );
  };
  const openConfirmationDeleteModal = (plantData) => {
    setconfirm_both(true);
    setActionData(plantData);
  };

  const onEditPlan = (plantData) => {
    setActionData(plantData);
    setShowModel(true);
  };

  const onDeleteDriver = () => {
    const URL = {
      endpoint: `/plant/${actionData?.id}`,
      type: "DELETE",
    };
    API_CALL.sendRequest(URL, null, null, "Delete Successfully");
    setFlag(!flag);
  };

  const onSubmitForm = (payload) => {
    (async () => {
      if (actionData?.id) {
        const URL = {
          endpoint: `/plant/${actionData?.id}`,
          type: "PATCH",
        };
        API_CALL.sendRequest(URL, null, payload, "Plant Update Successfully");
        setFlag(!flag);
      } else {
        API_CALL.sendRequest(
          CONSTANT.API.addPlant,
          null,
          payload,
          "Plant Add Successfully"
        );
        setFlag(!flag);
      }
    })();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Row>
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="page-title mb-0 font-size-18">Plants</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                    Welcome to Fitsol Dashboard
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Row>
        <Button
          color="primary"
          className="btn btn-primary waves-effect waves-light mb-3"
          onClick={() => setShowModel(true)}
        >
          <i className="bx bx-plus"></i> &nbsp; Add Plant
        </Button>
      </div>
      <Table
        title="Plants List"
        data={{ columns: getTableData("plant")["columns"], rows: plantData }}
      />
      <CustomModal
        modalType="formModal"
        show={showModel}
        close={() => setShowModel(false)}
        modalTitle="Add Plant"
        onSubmit={(data) => onSubmitForm(data)}
        data={CONSTANT.FORM_FIELDS.PLANT}
        defaultData={actionData}
        formData={false}
      />
      {confirm_both ? (
        <SweetAlert
          title="Are you sure?"
          warning
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            onDeleteDriver();
            setconfirm_both(false);
          }}
          onCancel={() => {
            setconfirm_both(false);
          }}
        >
          You won't be able to revert this!
        </SweetAlert>
      ) : null}
    </React.Fragment>
  );
};

export default Plants;
