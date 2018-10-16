Push-Location
try {
	get-childitem -Directory | foreach {
		Write-Host "============ Restoring Components *** $_ *** ============"
		cd $_
		yarn install
		cd ..
	}

	get-childitem -Directory | foreach {
		Write-Host "============ Building Component *** $_ *** ============"
		cd $_
		yarn run prepublishOnly
		cd ..
	}
} finally {
	Pop-Location
}
