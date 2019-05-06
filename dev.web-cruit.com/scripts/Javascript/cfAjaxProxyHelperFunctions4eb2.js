genericErrorHandler = function(statusCode, statusMsg)
{
	var errMsg = "REMOTE ERROR: " + statusCode + " " + statusMsg;
	alert(errMsg);
}

getColumnIdFor = function(colName, data)
{
	var index = -1;
	var i = 0;
	for (i=0; i < data.COLUMNS.length; i++)
	{
		if (data.COLUMNS[i].toLowerCase() == colName.toLowerCase())
			index = i;

		if (index != -1)
			break;
	}

	return index;
}