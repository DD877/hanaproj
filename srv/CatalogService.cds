using { dibyak.db.master ,dibyak.db.transaction,dibyak.db.CDSViews,CV_PURC } from '../db/datamodel';



service CatalogService@(path:'/CatalogService') {

//@readonly
@Capabilities : { Insertable,Updatable,Deletable }
    entity EmployeeSet as projection on master.employees;
@readonly
    entity AddressSet as projection on master.address;

    entity ProductSet as projection on master.product;

    entity BPSet as projection on master.businesspartner;

    entity POs @(
        title: '{i18n>poHeader}'
    ) as projection on transaction.purchaseorder{
        *,
        Items: redirected to POItems
    }actions{
        function largestOrder() returns array of POs;
        action boost();
    }

    entity POItems @( title : '{i18n>poItems}' )
    as projection on transaction.poitems{
        *,
        PARENT_KEY: redirected to POs,
        PRODUCT_GUID: redirected to ProductSet
    }

    entity POWorklist as projection on CDSViews.POWorklist;
    entity ProductOrders as projection on CDSViews.ProductViewSub;
    entity ProductAggregation as projection on CDSViews.CProductValuesView excluding{
        ProductId
    };
function sleep() returns Boolean;
  entity PurchaseOrders as projection on CV_PURC;

}
