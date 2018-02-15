(function() {

    let $benefitSelect = $("#benefit"),
        $benefitSubtypeSelect = $("#benefit-sub"),
        $handovertypeSelect = $("#handover-type"),
        $handoverReasonSelect = $("#handover-reason"),
        $benefitSubtypeDiv = $("#benSubTypeDiv"),
        $benefitSelectOptions = $benefitSelect.find("option:eq(0)"),
        $benefitSubtypeOptions = $benefitSubtypeSelect.find("option:gt(0)"),
        $handovertypeOptions = $handovertypeSelect.find("option:gt(0)"),
        $handoverReasonOptions = $handoverReasonSelect.find("option:gt(0)");

    $(document).ready(function() {
        benefitDropdownRefresh();
        hideBenefitSubtypeDropdown();
        handoverTypeRefresh();
        handoverReasonRefresh();
    });

    $benefitSelect.on("change", function() {
        let selectedBenefitId = this.value;

        hideBenefitSubtypeDropdown();
        handoverTypeRefresh();
        handoverReasonRefresh();

        if($benefitSelect.val() !== "") {
            if(benefitHavingSubtypes(selectedBenefitId)) {
                showBenefitSubtypeDropdownWithOptions(selectedBenefitId);
            }else{
                showHandoverTypeDropdownForDefaultBenefitSubtype(selectedBenefitId)
            }
        }
    });

    function showBenefitSubtypeDropdownWithOptions(selectedBenefitId){
        showBenefitSubtypeDropdown();
        sortOptionsForBenefitSubtype(selectedBenefitId);
        $benefitSubtypeOptions.find("option:eq(0)").prop("selected", true);
    }

    function showHandoverTypeDropdownForDefaultBenefitSubtype(selectedBenefitId){
        let defaultBenefitsubtypeId = $benefitSubtypeOptions.filter("[data-benefitSubtype-id="+ selectedBenefitId +"]").val();
        sortOptionsForHandoverType(defaultBenefitsubtypeId);
        $handovertypeOptions.find("option:eq(0)").prop("selected", true);
    }

    function sortOptionsForBenefitSubtype(selectedBenefitId) {
        //show options only for selected benefit and hide others
        $benefitSubtypeOptions.filter("[data-benefitSubtype-id="+ selectedBenefitId +"]").optVisible(true);
        $benefitSubtypeOptions.filter("[data-benefitSubtype-id!="+ selectedBenefitId +"]").optVisible(false);
    }

    $benefitSubtypeSelect.on("change", function() {
        handoverTypeRefresh();
        handoverReasonRefresh();

        if($benefitSubtypeSelect.val() !== "") {
            sortOptionsForHandoverType(this.value);
            $handovertypeOptions.find("option:eq(0)").prop("selected", true);
        }
    });

    $handovertypeSelect.on("change", function() {
        handoverReasonRefresh();

        if($handovertypeSelect.val() !== "") {
            sortOptionsForHandoverReason(this.value);
            $handoverReasonOptions.find("option:eq(0)").prop("selected", true);
        }
    });


    function benefitHavingSubtypes(selectedBenefitId){
        return $benefitSubtypeOptions.filter("[data-benefitSubtype-id=" + selectedBenefitId + "]").length > 1;
    }

    function sortOptionsForHandoverType(selectedBenefitSubtypeId) {
        $handovertypeOptions.filter("[data-handovertype-id="+ selectedBenefitSubtypeId +"]").optVisible(true);
        $handovertypeOptions.filter("[data-handovertype-id!="+ selectedBenefitSubtypeId +"]").optVisible(false);
    }

    function sortOptionsForHandoverReason(selectedBenefitSubtypeId) {
        $handoverReasonOptions.filter("[data-handoverReason-id="+ selectedBenefitSubtypeId +"]").optVisible(true);
        $handoverReasonOptions.filter("[data-handoverReason-id!="+ selectedBenefitSubtypeId +"]").optVisible(false);
    }

    function benefitDropdownRefresh(){
        $benefitSelectOptions.find("option:eq(0)").prop("selected", true);
    }

    function handoverTypeRefresh(){
        $handovertypeSelect.find("option:eq(0)").prop("selected", true);
        $handovertypeOptions.filter("*").optVisible(false);
    }

    function handoverReasonRefresh(){
        $handoverReasonSelect.find("option:eq(0)").prop("selected", true);
        $handoverReasonOptions.filter("*").optVisible(false);
    }

    function hideBenefitSubtypeDropdown(){
        $benefitSubtypeDiv.addClass("hidden");
    }

    function showBenefitSubtypeDropdown(){
        $benefitSubtypeDiv.removeClass("hidden");
    }



})();